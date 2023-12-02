import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../../ConnectionPool";

export const validate_sale_at =
  (pool: ConnectionPool) =>
  (sale: IShoppingSale) =>
  async (visibleToCustomer: boolean): Promise<void> => {
    await validate((id) =>
      ShoppingApi.functional.shoppings.sellers.sales.at(pool.seller, id),
    )(sale);
    await validate((id) =>
      ShoppingApi.functional.shoppings.admins.sales.at(pool.admin, id),
    )(sale);

    if (visibleToCustomer)
      await validate((id) =>
        ShoppingApi.functional.shoppings.customers.sales.at(pool.admin, id),
      )(sale);
    else
      await TestValidator.httpError("customer cannot see the sale")(
        404,
        410,
        422,
      )(() =>
        validate((id) =>
          ShoppingApi.functional.shoppings.customers.sales.at(pool.admin, id),
        )(sale),
      );
  };

const validate =
  (fetcher: (id: string) => Promise<IShoppingSale>) =>
  async (sale: IShoppingSale): Promise<void> => {
    const read: IShoppingSale = await fetcher(sale.id);
    TestValidator.equals("read")(sale)(read);
  };
