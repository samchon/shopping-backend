import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitStock } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStock";
import { IShoppingSaleUnitStockSupplement } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStockSupplement";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { prepare_random_sale } from "./internal/prepare_random_sale";

export const test_api_shopping_sale_supplement = async (
  pool: ConnectionPool
): Promise<void> => {
  await test_api_shopping_actor_seller_join(pool);

  const input: IShoppingSale.ICreate = await prepare_random_sale(pool);
  for (const unit of input.units)
    for (const stock of unit.stocks) stock.quantity = 100;
  const sale: IShoppingSale =
    await ShoppingApi.functional.shoppings.sellers.sales.create(
      pool.seller,
      input
    );
  const unit: IShoppingSaleUnit = RandomGenerator.pick(sale.units);
  const stock: IShoppingSaleUnitStock = RandomGenerator.pick(unit.stocks);

  const supplements: IShoppingSaleUnitStockSupplement[] =
    await ArrayUtil.asyncRepeat(4)(() =>
      ShoppingApi.functional.shoppings.sellers.sales.units.stocks.supplements.create(
        pool.seller,
        sale.id,
        unit.id,
        stock.id,
        {
          value: 100,
        }
      )
    );
  const page: IPage<IShoppingSaleUnitStockSupplement> =
    await ShoppingApi.functional.shoppings.sellers.sales.units.stocks.supplements.index(
      pool.seller,
      sale.id,
      unit.id,
      stock.id,
      {
        limit: 10,
        sort: ["+created_at"],
      }
    );
  TestValidator.equals("supplements")(supplements)(page.data);

  const reload: IShoppingSale =
    await ShoppingApi.functional.shoppings.sellers.sales.at(
      pool.seller,
      sale.id
    );
  const stockAgain: IShoppingSaleUnitStock | undefined = reload.units
    .find((u) => u.id === unit.id)
    ?.stocks.find((s) => s.id === stock.id);
  if (stockAgain === undefined)
    throw new Error("Failed to find the matched stock");
  TestValidator.equals("inventory.income")(500)(stockAgain.inventory.income);
};
