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

export namespace ShoppingDepositHistoryProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_deposit_historiesGetPayload<
        ReturnType<typeof select>
      >,
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
      } satisfies Prisma.shopping_deposit_historiesFindManyArgs);
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index =
    (citizen: IShoppingCitizen) =>
    (
      input: IShoppingDepositHistory.IRequest,
    ): Promise<IPage<IShoppingDepositHistory>> =>
      PaginationUtil.paginate({
        schema: ShoppingGlobal.prisma.shopping_deposit_histories,
        payload: json.select(),
        transform: json.transform,
      })({
        where: {
          AND: [{ shopping_citizen_id: citizen.id }, ...search(input.search)],
        },
        orderBy: input.sort?.length
          ? PaginationUtil.orderBy(orderBy)(input.sort)
          : [{ created_at: "desc" }],
      })(input);

  const search = (
    input: IShoppingDepositHistory.IRequest.ISearch | undefined,
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
    value: "asc" | "desc",
  ) =>
    (key === "history.created_at"
      ? { created_at: value }
      : key === "history.value"
      ? { value: value }
      : {
          deposit: ShoppingDepositProvider.orderBy(key, value),
        }) satisfies Prisma.shopping_deposit_historiesOrderByWithRelationInput;

  export const at =
    (citizen: IShoppingCitizen) =>
    async (id: string): Promise<IShoppingDepositHistory> => {
      const record =
        await ShoppingGlobal.prisma.shopping_deposit_histories.findFirstOrThrow(
          {
            where: { id, shopping_citizen_id: citizen.id },
            ...json.select(),
          },
        );
      return json.transform(record);
    };

  export const balance = async (citizen: IEntity): Promise<number> => {
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
  export const create =
    (citizen: IEntity) =>
    (depositCode: string) =>
    async (source: IEntity, value: number): Promise<void> => {
      await process(citizen)(depositCode)({
        task: async () => source,
        source: (entity) => entity,
        value,
      });
    };

  export const process =
    (citizen: IEntity) =>
    (depositCode: string) =>
    async <T extends IEntity>(props: {
      task: () => Promise<T>;
      source: (entity: T) => IEntity;
      value: number;
    }): Promise<T> => {
      const deposit: IShoppingDeposit = await ShoppingDepositProvider.get(
        depositCode,
      );
      const previous: number = await balance(citizen);
      const increment: number = deposit.direction * props.value;
      const after: number = previous + increment;
      if (after < 0) throw ErrorProvider.paymentRequired("not enough deposit");

      const entity: T = await props.task();
      const record =
        await ShoppingGlobal.prisma.shopping_deposit_histories.create({
          data: {
            id: v4(),
            deposit: {
              connect: { id: deposit.id },
            },
            citizen: {
              connect: { id: citizen.id },
            },
            source_id: props.source(entity).id,
            value: props.value,
            balance: previous,
            created_at: new Date(),
          },
        });

      await ShoppingGlobal.prisma.mv_shopping_deposit_balances.upsert({
        where: {
          shopping_citizen_id: citizen.id,
        },
        create: {
          shopping_citizen_id: citizen.id,
          value: after,
        },
        update: {
          value: {
            increment,
          },
        },
      });
      await ShoppingGlobal.prisma.shopping_deposit_histories.updateMany({
        where: {
          shopping_citizen_id: citizen.id,
          created_at: {
            gte: record.created_at,
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

  export const cancel =
    (citizen: IEntity) =>
    (depositCode: string) =>
    async <T>(props: {
      task: () => Promise<T>;
      source: (entity: T) => IEntity;
    }): Promise<T> => {
      const deposit: IShoppingDeposit = await ShoppingDepositProvider.get(
        depositCode,
      );
      const entity: T = await props.task();
      const history =
        await ShoppingGlobal.prisma.shopping_deposit_histories.findFirstOrThrow(
          {
            where: {
              shopping_deposit_id: deposit.id,
              source_id: props.source(entity).id,
              shopping_citizen_id: citizen.id,
            },
          },
        );
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
          shopping_citizen_id: citizen.id,
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
          shopping_citizen_id: citizen.id,
        },
        data: {
          value: {
            decrement,
          },
        },
      });
      return entity;
    };
}
