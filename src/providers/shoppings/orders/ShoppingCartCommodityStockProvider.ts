import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IShoppingCartCommodityStock } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodityStock";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";

import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingSaleSnapshotUnitProvider } from "../sales/ShoppingSaleSnapshotUnitProvider";
import { ShoppingCartCommodityStockChoiceProvider } from "./ShoppingCartCommodityStockChoiceProvider";

export namespace ShoppingCartCommodityStockProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_cart_commodity_stocksGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleUnit.IInvert => {
      if (input.stock.mv_inventory === null)
        throw ErrorProvider.internal("No inventory status exists.");
      return {
        ...ShoppingSaleSnapshotUnitProvider.invert.transform(input.stock.unit),
        stocks: [
          {
            id: input.stock.id,
            name: input.stock.name,
            quantity: input.quantity,
            choices: input.choices
              .sort((a, b) => a.sequence - b.sequence)
              .map(ShoppingCartCommodityStockChoiceProvider.json.transform),
            price: {
              nominal: input.stock.nominal_price,
              real: input.stock.real_price,
            },
            inventory: {
              income: input.stock.mv_inventory.income,
              outcome: input.stock.mv_inventory.outcome,
            },
          },
        ],
      };
    };
    export const select = () =>
      ({
        include: {
          choices: ShoppingCartCommodityStockChoiceProvider.json.select(),
          stock: {
            include: {
              unit: ShoppingSaleSnapshotUnitProvider.invert.select(),
              mv_inventory: true,
            },
          },
        },
      } satisfies Prisma.shopping_cart_commodity_stocksFindManyArgs);
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const collect = (
    input: IShoppingCartCommodityStock.ICreate,
    sequence: number,
  ) =>
    ({
      id: v4(),
      choices: {
        create: input.choices.map(
          ShoppingCartCommodityStockChoiceProvider.collect,
        ),
      },
      unit: {
        connect: { id: input.unit_id },
      },
      stock: {
        connect: { id: input.stock_id },
      },
      quantity: input.quantity,
      sequence,
    } satisfies Prisma.shopping_cart_commodity_stocksCreateWithoutCommodityInput);
}
