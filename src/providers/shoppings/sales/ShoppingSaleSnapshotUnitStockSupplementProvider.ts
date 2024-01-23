import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSaleUnitStockSupplement } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStockSupplement";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { PaginationUtil } from "../../../utils/PaginationUtil";

export namespace ShoppingSaleSnapshotUnitStockSupplementProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_unit_stock_supplementsGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleUnitStockSupplement => ({
      id: input.id,
      value: input.quantity,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_sale_snapshot_unit_stock_supplementsFindManyArgs;
  }

  export const index =
    (seller: IShoppingSeller.IInvert) =>
    (related: { sale: IEntity; unit: IEntity; stock: IEntity }) =>
    (
      input: IShoppingSaleUnitStockSupplement.IRequest,
    ): Promise<IPage<IShoppingSaleUnitStockSupplement>> =>
      PaginationUtil.paginate({
        schema:
          ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stock_supplements,
        payload: json.select(),
        transform: json.transform,
      })({
        where: {
          stock: {
            id: related.stock.id,
            unit: {
              id: related.unit.id,
              snapshot: {
                mv_last: { isNot: null },
                sale: {
                  id: related.sale.id,
                  sellerCustomer: {
                    member: {
                      of_seller: {
                        id: seller.id,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: input.sort?.length
          ? PaginationUtil.orderBy((_column, value) => ({
              created_at: value,
            }))(input.sort)
          : [{ created_at: "asc" }],
      })(input);

  export const create =
    (seller: IShoppingSeller.IInvert) =>
    (related: { sale: IEntity; unit: IEntity; stock: IEntity }) =>
    async (
      input: IShoppingSaleUnitStockSupplement.ICreate,
    ): Promise<IShoppingSaleUnitStockSupplement> => {
      const stock =
        await ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stocks.findFirstOrThrow(
          {
            where: {
              id: related.stock.id,
              unit: {
                id: related.unit.id,
                snapshot: {
                  mv_last: { isNot: null },
                  sale: {
                    id: related.sale.id,
                    sellerCustomer: {
                      member: {
                        of_seller: {
                          id: seller.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        );
      const record =
        await ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stock_supplements.create(
          {
            data: {
              id: v4(),
              shopping_sale_snapshot_unit_stock_id: stock.id,
              quantity: input.value,
              created_at: new Date(),
            },
            ...json.select(),
          },
        );
      await ShoppingGlobal.prisma.mv_shopping_sale_snapshot_unit_stock_inventories.update(
        {
          where: {
            shopping_sale_snapshot_unit_stock_id: stock.id,
          },
          data: {
            income: {
              increment: input.value,
            },
          },
        },
      );
      return json.transform(record);
    };

  export const update =
    (seller: IShoppingSeller.IInvert) =>
    (related: { sale: IEntity; unit: IEntity; stock: IEntity }) =>
    (id: string) =>
    async (input: IShoppingSaleUnitStockSupplement.IUpdate): Promise<void> => {
      const supplement =
        await ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stock_supplements.findFirstOrThrow(
          {
            where: {
              id,
              stock: {
                id: related.stock.id,
                unit: {
                  id: related.unit.id,
                  snapshot: {
                    mv_last: { isNot: null },
                    sale: {
                      id: related.sale.id,
                      sellerCustomer: {
                        member: {
                          of_seller: {
                            id: seller.id,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        );
      await ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stock_supplements.update(
        {
          where: {
            id,
          },
          data: {
            quantity: input.value,
          },
        },
      );
      await ShoppingGlobal.prisma.mv_shopping_sale_snapshot_unit_stock_inventories.update(
        {
          where: {
            shopping_sale_snapshot_unit_stock_id: related.stock.id,
          },
          data: {
            income: {
              increment: input.value - supplement.quantity,
            },
          },
        },
      );
    };

  export const erase =
    (seller: IShoppingSeller.IInvert) =>
    (related: { sale: IEntity; unit: IEntity; stock: IEntity }) =>
    async (id: string): Promise<void> => {
      const supplement =
        await ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stock_supplements.findFirstOrThrow(
          {
            where: {
              id,
              stock: {
                id: related.stock.id,
                unit: {
                  id: related.unit.id,
                  snapshot: {
                    mv_last: { isNot: null },
                    sale: {
                      id: related.sale.id,
                      sellerCustomer: {
                        member: {
                          of_seller: {
                            id: seller.id,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        );
      await ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stock_supplements.delete(
        {
          where: {
            id,
          },
        },
      );
      await ShoppingGlobal.prisma.mv_shopping_sale_snapshot_unit_stock_inventories.update(
        {
          where: {
            shopping_sale_snapshot_unit_stock_id: related.stock.id,
          },
          data: {
            income: {
              decrement: supplement.quantity,
            },
          },
        },
      );
    };
}
