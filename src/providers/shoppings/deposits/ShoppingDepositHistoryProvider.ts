import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";
import { IShoppingDeposit } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDeposit";
import { IShoppingDepositHistory } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositHistory";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { ShoppingCitizenProvider } from "../actors/ShoppingCitizenProvider";
import { ShoppingDepositProvider } from "./ShoppingDepositProvider";
import { ICodeEntity } from "@samchon/shopping-api/lib/structures/common/ICodeEntity";

export namespace ShoppingDepositHistoryProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_deposit_historiesGetPayload<
        ReturnType<typeof select>
      >
    ): IShoppingDepositHistory => ({
      id: input.id,
      citizen: ShoppingCitizenProvider.json.transform(input.citizen),
      deposit: ShoppingDepositProvider.json.transform(input.deposit),
      source_id: input.source_id,
      value: input.value,
      balance: input.balance,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          citizen: ShoppingCitizenProvider.json.select(),
          deposit: ShoppingDepositProvider.json.select(),
        },
      }) satisfies Prisma.shopping_deposit_historiesFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = (props: {
    citizen: IShoppingCitizen;
    input: IShoppingDepositHistory.IRequest;
  }): Promise<IPage<IShoppingDepositHistory>> =>
    PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_deposit_histories,
      payload: json.select(),
      transform: json.transform,
    })({
      where: {
        AND: [
          { shopping_citizen_id: props.citizen.id },
          ...search(props.input.search),
        ],
      },
      orderBy: props.input.sort?.length
        ? PaginationUtil.orderBy(orderBy)(props.input.sort)
        : [{ created_at: "desc" }],
    })(props.input);

  const search = (
    input: IShoppingDepositHistory.IRequest.ISearch | undefined
  ) =>
    [
      ...(input?.deposit !== undefined
        ? ShoppingDepositProvider.search(input.deposit).map((deposit) => ({
            deposit,
          }))
        : []),
      ...(input?.citizen_id?.length
        ? [
            {
              shopping_citizen_id: input.citizen_id,
            },
          ]
        : []),
      ...(input?.from?.length
        ? [
            {
              created_at: {
                gte: input.from,
              },
            },
          ]
        : []),
      ...(input?.to?.length
        ? [
            {
              created_at: {
                lte: input.to,
              },
            },
          ]
        : []),
      ...(input?.minimum !== undefined
        ? [
            {
              value: {
                gte: input.minimum,
              },
            },
          ]
        : []),
      ...(input?.maximum !== undefined
        ? [
            {
              value: {
                lte: input.maximum,
              },
            },
          ]
        : []),
    ] satisfies Prisma.shopping_deposit_historiesWhereInput["AND"];

  const orderBy = (
    key: IShoppingDepositHistory.IRequest.SortableColumns,
    value: "asc" | "desc"
  ) =>
    (key === "history.created_at"
      ? { created_at: value }
      : key === "history.value"
        ? { value: value }
        : {
            deposit: ShoppingDepositProvider.orderBy(key, value),
          }) satisfies Prisma.shopping_deposit_historiesOrderByWithRelationInput;

  export const at = async (props: {
    citizen: IShoppingCitizen;
    id: string;
  }): Promise<IShoppingDepositHistory> => {
    const record =
      await ShoppingGlobal.prisma.shopping_deposit_histories.findFirstOrThrow({
        where: {
          id: props.id,
          shopping_citizen_id: props.citizen.id,
        },
        ...json.select(),
      });
    return json.transform(record);
  };

  export const getBalance = async (citizen: IEntity): Promise<number> => {
    const record =
      await ShoppingGlobal.prisma.mv_shopping_deposit_balances.findFirst({
        where: {
          shopping_citizen_id: citizen.id,
        },
      });
    return record?.value ?? 0;
  };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const emplace = async (props: {
    citizen: IEntity;
    deposit: ICodeEntity;
    source: IEntity;
    value: number;
  }): Promise<void> => {
    await process({
      ...props,
      task: async () => props.source,
    });
  };

  export const process = async <T extends IEntity>(props: {
    citizen: IEntity;
    deposit: ICodeEntity;
    source: IEntity;
    value: number;
    task: () => Promise<T>;
  }): Promise<T> => {
    const deposit: IShoppingDeposit = await ShoppingDepositProvider.get(
      props.deposit.code
    );
    const previous =
      await ShoppingGlobal.prisma.shopping_deposit_histories.findFirst({
        where: {
          shopping_citizen_id: props.citizen.id,
          shopping_deposit_id: deposit.id,
          source_id: props.source.id,
          cancelled_at: null,
        },
      });
    const increment: number =
      deposit.direction * (props.value - (previous?.value ?? 0));
    const balance: number = increment + (await getBalance(props.citizen));
    if (balance < 0) throw ErrorProvider.paymentRequired("not enough deposit");

    const entity: T = await props.task();
    const record =
      previous === null
        ? await ShoppingGlobal.prisma.shopping_deposit_histories.create({
            data: {
              id: v4(),
              deposit: {
                connect: { id: deposit.id },
              },
              citizen: {
                connect: { id: props.citizen.id },
              },
              source_id: props.source.id,
              value: props.value,
              balance,
              created_at: new Date(),
            },
          })
        : await ShoppingGlobal.prisma.shopping_deposit_histories.update({
            where: {
              id: previous.id,
            },
            data: {
              value: props.value,
              balance,
            },
          });

    await ShoppingGlobal.prisma.mv_shopping_deposit_balances.upsert({
      where: {
        shopping_citizen_id: props.citizen.id,
      },
      create: {
        shopping_citizen_id: props.citizen.id,
        value: balance,
      },
      update: {
        value: {
          increment,
        },
      },
    });
    await ShoppingGlobal.prisma.shopping_deposit_histories.updateMany({
      where: {
        shopping_citizen_id: props.citizen.id,
        created_at: {
          gt: record.created_at,
        },
        cancelled_at: null,
      },
      data: {
        balance: {
          increment,
        },
      },
    });
    return entity;
  };

  export const cancel = async (props: {
    citizen: IEntity;
    deposit: ICodeEntity;
    source: IEntity;
  }): Promise<void> => {
    const deposit: IShoppingDeposit = await ShoppingDepositProvider.get(
      props.deposit.code
    );
    const history =
      await ShoppingGlobal.prisma.shopping_deposit_histories.findFirstOrThrow({
        where: {
          shopping_deposit_id: deposit.id,
          source_id: props.source.id,
          shopping_citizen_id: props.citizen.id,
        },
      });
    await ShoppingGlobal.prisma.shopping_deposit_histories.update({
      where: {
        id: history.id,
      },
      data: {
        cancelled_at: new Date(),
      },
    });

    const decrement: number = deposit.direction * history.value;
    await ShoppingGlobal.prisma.shopping_deposit_histories.updateMany({
      where: {
        shopping_citizen_id: props.citizen.id,
        created_at: {
          gte: history.created_at,
        },
      },
      data: {
        value: {
          decrement,
        },
      },
    });
    await ShoppingGlobal.prisma.mv_shopping_deposit_balances.update({
      where: {
        shopping_citizen_id: props.citizen.id,
      },
      data: {
        value: {
          decrement,
        },
      },
    });
  };
}
