import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";

import { validate_api_shopping_order_discountable } from "./internal/validate_api_shopping_order_discountable";

export const test_api_shopping_order_discount_after_discount =
  validate_api_shopping_order_discountable(async (pool, props) => {
    const combination: IShoppingOrderDiscountable.ICombination =
      props.discountable.combinations[0];

    const discount = async () => {
      const price: IShoppingOrderPrice =
        await ShoppingApi.functional.shoppings.customers.orders.discount(
          pool.customer,
          props.order.id,
          {
            deposit: 0,
            mileage: 0,
            coupon_ids: combination.coupons.map((coupon) => coupon.id),
          },
        );
      return price;
    };
    const first: IShoppingOrderPrice = await discount();
    const second: IShoppingOrderPrice = await discount();

    TestValidator.equals(
      "coupons",
      first.ticket_payments
        .map((tp) => tp.ticket.coupon)
        .sort((x, y) => x.id.localeCompare(y.id)),
      second.ticket_payments
        .map((tp) => tp.ticket.coupon)
        .sort((x, y) => x.id.localeCompare(y.id)),
    );
  });
