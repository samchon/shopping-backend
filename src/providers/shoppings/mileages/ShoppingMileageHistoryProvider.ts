import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";
import { IShoppingMileage } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileage";
import { IShoppingMileageHistory } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageHistory";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { ShoppingCitizenProvider } from "../actors/ShoppingCitizenProvider";
import { ShoppingMileageProvider } from "./ShoppingMileageProvider";

export namespace ShoppingMileageHistoryProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_mileage_historiesGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingMileageHistory => ({
      id: input.id,
      citizen: ShoppingCitizenProvider.json.transform(input.citizen),
      mileage: ShoppingMileageProvider.json.transform(input.mileage),
      source_id: input.source_id,
      value: input.value,
      balance: input.balance,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          citizen: ShoppingCitizenProvider.json.select(),
          mileage: ShoppingMileageProvider.json.select(),
        },
      }) satisfies Prisma.shopping_mileage_historiesFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index =
    (citizen: IShoppingCitizen) =>
    (
      input: IShoppingMileageHistory.IRequest,
    ): Promise<IPage<IShoppingMileageHistory>> =>
      PaginationUtil.paginate({
        schema: ShoppingGlobal.prisma.shopping_mileage_histories,
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
    input: IShoppingMileageHistory.IRequest.ISearch | undefined,
  ) =>
    [
      ...(input?.mileage !== undefined
        ? ShoppingMileageProvider.search(input.mileage).map((mileage) => ({
            mileage,
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
    ] satisfies Prisma.shopping_mileage_historiesWhereInput["AND"];

  const orderBy = (
    key: IShoppingMileageHistory.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    (key === "history.created_at"
      ? { created_at: value }
      : key === "history.value"
        ? { value: value }
        : {
            mileage: ShoppingMileageProvider.orderBy(key, value),
          }) satisfies Prisma.shopping_mileage_historiesOrderByWithRelationInput;

  export const at =
    (citizen: IShoppingCitizen) =>
    async (id: string): Promise<IShoppingMileageHistory> => {
      const record =
        await ShoppingGlobal.prisma.shopping_mileage_histories.findFirstOrThrow(
          {
            where: { id, shopping_citizen_id: citizen.id },
            ...json.select(),
          },
        );
      return json.transform(record);
    };

  export const getBalance = async (citizen: IEntity): Promise<number> => {
    const record =
      await ShoppingGlobal.prisma.mv_shopping_mileage_balances.findFirst({
        where: {
          shopping_citizen_id: citizen.id,
        },
      });
    return record?.value ?? 0;
  };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const emplace =
    (citizen: IEntity) =>
    (mileageCode: string) =>
    async (
      source: IEntity,
      value: (value: number | null) => number,
    ): Promise<void> => {
      await process(citizen)(mileageCode)({
        task: async () => source,
        source: (entity) => entity,
        value,
      });
    };

  export const process =
    (citizen: IEntity) =>
    (mileageCode: string) =>
    async <T extends IEntity>(props: {
      task: () => Promise<T>;
      source: (entity: T) => IEntity;
      value: (value: number | null) => number;
    }): Promise<T> => {
      const mileage: IShoppingMileage =
        await ShoppingMileageProvider.get(mileageCode);
      const previous =
        await ShoppingGlobal.prisma.shopping_mileage_histories.findFirst({
          where: {
            shopping_mileage_id: mileage.id,
            shopping_citizen_id: citizen.id,
            cancelled_at: null,
          },
        });
      const increment: number =
        mileage.direction *
        (props.value(mileage.value) - (previous?.value ?? 0));
      const balance: number = increment + (await getBalance(citizen));
      if (balance < 0)
        throw ErrorProvider.paymentRequired("not enough mileage");

      const entity: T = await props.task();
      const record =
        previous === null
          ? await ShoppingGlobal.prisma.shopping_mileage_histories.create({
              data: {
                id: v4(),
                mileage: {
                  connect: { id: mileage.id },
                },
                citizen: {
                  connect: { id: citizen.id },
                },
                source_id: props.source(entity).id,
                value: props.value(mileage.value),
                balance,
                created_at: new Date(),
              },
            })
          : await ShoppingGlobal.prisma.shopping_mileage_histories.update({
              where: {
                id: previous.id,
              },
              data: {
                value: props.value(mileage.value),
                balance,
              },
            });

      await ShoppingGlobal.prisma.mv_shopping_mileage_balances.upsert({
        where: {
          shopping_citizen_id: citizen.id,
        },
        create: {
          shopping_citizen_id: citizen.id,
          value: balance,
        },
        update: {
          value: {
            increment,
          },
        },
      });
      await ShoppingGlobal.prisma.shopping_mileage_histories.updateMany({
        where: {
          shopping_citizen_id: citizen.id,
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

  export const cancel =
    (citizen: IEntity) =>
    (mileageCode: string) =>
    async (source: IEntity): Promise<void> => {
      const mileage: IShoppingMileage =
        await ShoppingMileageProvider.get(mileageCode);
      const history =
        await ShoppingGlobal.prisma.shopping_mileage_histories.findFirstOrThrow(
          {
            where: {
              shopping_mileage_id: mileage.id,
              source_id: source.id,
              shopping_citizen_id: citizen.id,
            },
          },
        );
      await ShoppingGlobal.prisma.shopping_mileage_histories.update({
        where: {
          id: history.id,
        },
        data: {
          cancelled_at: new Date(),
        },
      });

      const decrement: number = mileage.direction * history.value;
      await ShoppingGlobal.prisma.shopping_mileage_histories.updateMany({
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
      await ShoppingGlobal.prisma.mv_shopping_mileage_balances.update({
        where: {
          shopping_citizen_id: citizen.id,
        },
        data: {
          value: {
            decrement,
          },
        },
      });
    };
}
