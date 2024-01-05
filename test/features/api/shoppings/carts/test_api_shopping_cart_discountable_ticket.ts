import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCouponTicket } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponTicket";
import { IShoppingCartDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartDiscountable";

import { validate_api_shopping_cart_discountable } from "./internal/validate_api_shopping_cart_discountable";

export const test_api_shopping_cart_discountable_ticket =
  validate_api_shopping_cart_discountable(async (pool, props) => {
    const tickets: IShoppingCouponTicket[] = await ArrayUtil.asyncMap(
      props.coupons,
    )((coupon) =>
      ShoppingApi.functional.shoppings.customers.coupons.tickets.create(
        pool.customer,
        {
          coupon_id: coupon.id,
        },
      ),
    );
    typia.assertEquals(tickets);

    const discountable: IShoppingCartDiscountable =
      await ShoppingApi.functional.shoppings.customers.carts.commodities.discountable(
        pool.customer,
        null,
        {
          commodity_ids: props.commodities.map((commodity) => commodity.id),
          pseudos: [],
        },
      );
    typia.assertEquals(discountable);

    TestValidator.equals("combinations[].amount")(
      discountable.combinations.map((c) => c.amount),
    )(props.discountable.combinations.map((c) => c.amount));
    TestValidator.equals("combinations[].coupons.length")(
      discountable.combinations.map((comb) => comb.coupons.length),
    )([0, 0]);
    TestValidator.equals("combinations[].tickets.length")(
      discountable.combinations.map((comb) => comb.tickets.length),
    )([3, 1]);
  });
