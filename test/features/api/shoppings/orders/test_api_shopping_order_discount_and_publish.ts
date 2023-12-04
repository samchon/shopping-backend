import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";

import { generate_random_order_publish } from "./internal/generate_random_order_publish";
import { validate_api_shopping_order_discountable } from "./internal/validate_api_shopping_order_discountable";

export const test_api_shopping_order_discount_and_publish =
  validate_api_shopping_order_discountable(async (pool, props) => {
    const combination: IShoppingOrderDiscountable.ICombination =
      props.discountable.combinations[0];
    const price: IShoppingOrderPrice =
      await ShoppingApi.functional.shoppings.customers.orders.discount(
        pool.customer,
        props.order.id,
        {
          deposit: 0,
          mileage: 0,
          coupon_ids: combination.coupons.map((c) => c.id),
        },
      );
    typia.assertEquals(price);

    await generate_random_order_publish(
      pool,
      props.customer,
      props.order,
      true,
    );
  });
