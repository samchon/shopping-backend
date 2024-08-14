import { ArrayUtil, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCouponTicket } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponTicket";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";

import { validate_api_shopping_order_discountable } from "./internal/validate_api_shopping_order_discountable";

export const test_api_shopping_order_discount_by_ticket =
  validate_api_shopping_order_discountable(async (pool, props) => {
    const combination: IShoppingOrderDiscountable.ICombination =
      props.discountable.combinations[0];
    const tickets: IShoppingCouponTicket[] = await ArrayUtil.asyncMap(
      combination.coupons,
    )((coupon) =>
      ShoppingApi.functional.shoppings.customers.coupons.tickets.create(
        pool.customer,
        {
          coupon_id: coupon.id,
        },
      ),
    );

    const price: IShoppingOrderPrice =
      await ShoppingApi.functional.shoppings.customers.orders.discount(
        pool.customer,
        props.order.id,
        {
          deposit: 0,
          mileage: 0,
          coupon_ids: tickets.map((ticket) => ticket.coupon.id),
        },
      );

    TestValidator.equals("amount")(price.ticket)(combination.amount);
    TestValidator.equals("coupons")(
      price.ticket_payments
        .map((tp) => tp.ticket.coupon)
        .sort((x, y) => x.id.localeCompare(y.id)),
    )(combination.coupons.sort((x, y) => x.id.localeCompare(y.id)));
  });
