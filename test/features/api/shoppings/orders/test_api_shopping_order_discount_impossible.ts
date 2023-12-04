import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";

import { validate_api_shopping_order_discountable } from "./internal/validate_api_shopping_order_discountable";

export const test_api_shopping_order_discount_impossible =
  validate_api_shopping_order_discountable(async (pool, props) => {
    const coupons: IShoppingCoupon[] = props.discountable.combinations.map(
      (comb) => comb.coupons[0],
    );
    await TestValidator.httpError("impossible")(422)(() =>
      ShoppingApi.functional.shoppings.customers.orders.discount(
        pool.customer,
        props.order.id,
        {
          deposit: 0,
          mileage: 0,
          coupon_ids: coupons.map((coupon) => coupon.id),
        },
      ),
    );
  });
