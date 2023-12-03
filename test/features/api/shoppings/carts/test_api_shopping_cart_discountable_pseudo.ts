import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingCartDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartDiscountable";

import { validate_api_shopping_cart_discountable } from "./internal/validate_api_shopping_cart_discountable";

export const test_api_shopping_cart_discountable_pseudo =
  validate_api_shopping_cart_discountable(async (pool, props) => {
    const pseudos: IShoppingCartCommodity.ICreate[] = await ArrayUtil.asyncMap(
      props.commodities,
    )((commodity) =>
      ShoppingApi.functional.shoppings.customers.carts.commodities.replica(
        pool.customer,
        null,
        commodity.id,
      ),
    );
    typia.assertEquals(pseudos);

    const discountable: IShoppingCartDiscountable =
      await ShoppingApi.functional.shoppings.customers.carts.commodities.discountable(
        pool.customer,
        null,
        {
          commodity_ids: [],
          pseudos,
        },
      );

    TestValidator.equals("combinations.length")(
      discountable.combinations.length,
    )(2);
    TestValidator.equals("combinations[].amount")(
      discountable.combinations.map((comb) => comb.amount),
    )([15_000, 5_000]);
    TestValidator.equals("combinations[].coupons.length")(
      discountable.combinations.map((comb) => comb.coupons.length),
    )([3, 1]);
  });
