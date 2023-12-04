import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingPrice } from "@samchon/shopping-api/lib/structures/shoppings/base/IShoppingPrice";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitStock } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStock";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_sale } from "./prepare_random_sale";

export const generate_random_sole_sale = async (
  pool: ConnectionPool,
  price: IShoppingPrice,
): Promise<IShoppingSale> => {
  const sale: IShoppingSale =
    await ShoppingApi.functional.shoppings.sellers.sales.create(
      pool.seller,
      await prepare_random_sole_sale(pool, price),
    );
  return typia.assertEquals(sale);
};

const prepare_random_sole_sale = async (
  pool: ConnectionPool,
  price: IShoppingPrice,
): Promise<IShoppingSale.ICreate> => {
  const sale: IShoppingSale.ICreate = await prepare_random_sale(pool);
  const unit: IShoppingSaleUnit.ICreate = sale.units[0];
  const stock: IShoppingSaleUnitStock.ICreate = unit.stocks[0];

  sale.units = [unit];
  unit.stocks = [stock];
  stock.price = price;

  unit.options = [];
  stock.choices = [];

  return sale;
};
