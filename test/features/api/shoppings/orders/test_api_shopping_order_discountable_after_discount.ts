import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";

import { validate_api_shopping_order_discountable } from "./internal/validate_api_shopping_order_discountable";

export const test_api_shopping_order_discountable_after_discount =
  validate_api_shopping_order_discountable(async (pool, props) => {
    await ShoppingApi.functional.shoppings.customers.orders.discount(
      pool.customer,
      props.order.id,
      {
        deposit: 0,
        mileage: 0,
        coupon_ids: props.discountable.combinations[0].coupons.map(
          (coupon) => coupon.id
        ),
      }
    );

    const discountable: IShoppingOrderDiscountable =
      await ShoppingApi.functional.shoppings.customers.orders.discountable(
        pool.customer,
        props.order.id,
        {
          good_ids: props.order.goods.map((good) => good.id),
        }
      );

    TestValidator.equals("discountable.combinations[].amount")(
      props.discountable.combinations[0].amount
    )(discountable.combinations[0].amount);
    TestValidator.equals("discountable.combinations[0].coupons")(
      props.discountable.combinations[0].tickets
        .map((t) => t.coupon)
        .sort((a, b) => a.id.localeCompare(b.id))
    )(
      discountable.combinations[0].coupons.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
    );
  });
