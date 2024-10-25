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
      >
    ): IShoppingSaleUnitStockSupplement => ({
      id: input.id,
      value: input.quantity,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_sale_snapshot_unit_stock_supplementsFindManyArgs;
  }

  export const index = async (props: {
    seller: IShoppingSeller.IInvert;
    sale: IEntity;
    unit: IEntity;
    stock: IEntity;
    input: IShoppingSaleUnitStockSupplement.IRequest;
  }): Promise<IPage<IShoppingSaleUnitStockSupplement>> =>
    PaginationUtil.paginate({
      schema:
        ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stock_supplements,
      payload: json.select(),
      transform: json.transform,
    })({
      where: {
        stock: {
          id: props.stock.id,
          unit: {
            id: props.unit.id,
            snapshot: {
              mv_last: { isNot: null },
              sale: {
                id: props.sale.id,
                sellerCustomer: {
                  member: {
                    of_seller: {
                      id: props.seller.id,
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: props.input.sort?.length
        ? PaginationUtil.orderBy((_column, value) => ({
            created_at: value,
          }))(props.input.sort)
        : [{ created_at: "asc" }],
    })(props.input);

  export const create = async (props: {
    seller: IShoppingSeller.IInvert;
    sale: IEntity;
    unit: IEntity;
    stock: IEntity;
    input: IShoppingSaleUnitStockSupplement.ICreate;
  }): Promise<IShoppingSaleUnitStockSupplement> => {
    const stock =
      await ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stocks.findFirstOrThrow(
        {
          where: {
            id: props.stock.id,
            unit: {
              id: props.unit.id,
              snapshot: {
                mv_last: { isNot: null },
                sale: {
                  id: props.sale.id,
                  sellerCustomer: {
                    member: {
                      of_seller: {
                        id: props.seller.id,
                      },
                    },
                  },
                },
              },
            },
          },
        }
      );
    const record =
      await ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stock_supplements.create(
        {
          data: {
            id: v4(),
            shopping_sale_snapshot_unit_stock_id: stock.id,
            quantity: props.input.value,
            created_at: new Date(),
          },
          ...json.select(),
        }
      );
    await ShoppingGlobal.prisma.mv_shopping_sale_snapshot_unit_stock_inventories.update(
      {
        where: {
          shopping_sale_snapshot_unit_stock_id: stock.id,
        },
        data: {
          income: {
            increment: props.input.value,
          },
        },
      }
    );
    return json.transform(record);
  };

  export const update = async (props: {
    seller: IShoppingSeller.IInvert;
    sale: IEntity;
    unit: IEntity;
    stock: IEntity;
    id: string;
    input: IShoppingSaleUnitStockSupplement.IUpdate;
  }): Promise<void> => {
    const supplement =
      await ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stock_supplements.findFirstOrThrow(
        {
          where: {
            id: props.id,
            stock: {
              id: props.stock.id,
              unit: {
                id: props.unit.id,
                snapshot: {
                  mv_last: { isNot: null },
                  sale: {
                    id: props.sale.id,
                    sellerCustomer: {
                      member: {
                        of_seller: {
                          id: props.seller.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }
      );
    await ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stock_supplements.update(
      {
        where: {
          id: props.id,
        },
        data: {
          quantity: props.input.value,
        },
      }
    );
    await ShoppingGlobal.prisma.mv_shopping_sale_snapshot_unit_stock_inventories.update(
      {
        where: {
          shopping_sale_snapshot_unit_stock_id: props.stock.id,
        },
        data: {
          income: {
            increment: props.input.value - supplement.quantity,
          },
        },
      }
    );
  };

  export const erase = async (props: {
    seller: IShoppingSeller.IInvert;
    sale: IEntity;
    unit: IEntity;
    stock: IEntity;
    id: string;
  }): Promise<void> => {
    const supplement =
      await ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stock_supplements.findFirstOrThrow(
        {
          where: {
            id: props.id,
            stock: {
              id: props.stock.id,
              unit: {
                id: props.unit.id,
                snapshot: {
                  mv_last: { isNot: null },
                  sale: {
                    id: props.sale.id,
                    sellerCustomer: {
                      member: {
                        of_seller: {
                          id: props.seller.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }
      );
    await ShoppingGlobal.prisma.shopping_sale_snapshot_unit_stock_supplements.delete(
      {
        where: {
          id: props.id,
        },
      }
    );
    await ShoppingGlobal.prisma.mv_shopping_sale_snapshot_unit_stock_inventories.update(
      {
        where: {
          shopping_sale_snapshot_unit_stock_id: props.stock.id,
        },
        data: {
          income: {
            decrement: supplement.quantity,
          },
        },
      }
    );
  };
}
