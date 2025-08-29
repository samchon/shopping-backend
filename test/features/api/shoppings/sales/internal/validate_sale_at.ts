import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../../ConnectionPool";

export const validate_sale_at = async (props: {
  pool: ConnectionPool;
  sale: IShoppingSale;
  visibleToCustomer: boolean;
}): Promise<void> => {
  await validate(
    (id) =>
      ShoppingApi.functional.shoppings.sellers.sales.at(props.pool.seller, id),
    props.sale,
  );
  await validate(
    (id) =>
      ShoppingApi.functional.shoppings.admins.sales.at(props.pool.admin, id),
    props.sale,
  );

  if (props.visibleToCustomer)
    await validate(
      (id) =>
        ShoppingApi.functional.shoppings.customers.sales.at(
          props.pool.admin,
          id,
        ),
      props.sale,
    );
  else
    await TestValidator.httpError(
      "customer cannot see the sale",
      [404, 410, 422],
      () =>
        validate(
          (id) =>
            ShoppingApi.functional.shoppings.customers.sales.at(
              props.pool.admin,
              id,
            ),
          props.sale,
        ),
    );
};

const validate = async (
  fetcher: (id: string) => Promise<IShoppingSale>,
  sale: IShoppingSale,
): Promise<void> => {
  const read: IShoppingSale = await fetcher(sale.id);
  TestValidator.equals("read", sale, read);
};
