import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";

import { generate_random_order } from "./internal/generate_random_order";
import { validate_api_shopping_order_discountable } from "./internal/validate_api_shopping_order_discountable";

export const test_api_shopping_order_discountable_after_erase =
  validate_api_shopping_order_discountable(async (pool, props) => {
    // GENERATE NEW ORDER WITH SAME COMPOSITION
    const commodities: IShoppingCartCommodity[] = await ArrayUtil.asyncMap(
      await ArrayUtil.asyncMap(props.order.goods.map((good) => good.commodity))(
        (commodity) =>
          ShoppingApi.functional.shoppings.customers.carts.commodities.replica(
            pool.customer,
            null,
            commodity.id,
          ),
      ),
    )((input) =>
      ShoppingApi.functional.shoppings.customers.carts.commodities.create(
        pool.customer,
        null,
        input,
      ),
    );
    typia.assertEquals(commodities);

    const order: IShoppingOrder = await generate_random_order(
      pool,
      commodities,
    );

    // REMOVE ORDINARY ORDER
    await ShoppingApi.functional.shoppings.customers.orders.erase(
      pool.customer,
      props.order.id,
    );

    // GET DISCOUNTABLE INFO
    const discountable: IShoppingOrderDiscountable =
      await ShoppingApi.functional.shoppings.customers.orders.discountable(
        pool.customer,
        order.id,
        {
          good_ids: order.goods.map((good) => good.id),
        },
      );
    typia.assertEquals(discountable);

    TestValidator.equals("discountable.combinations[].amount")(
      props.discountable.combinations[0].amount,
    )(discountable.combinations[0].amount);
    TestValidator.equals("discountable.combinations[].coupons[]")(
      props.discountable.combinations.map((comb) =>
        comb.coupons.sort((a, b) => a.id.localeCompare(b.id)),
      ),
    )(
      discountable.combinations.map((comb) =>
        comb.coupons.sort((a, b) => a.id.localeCompare(b.id)),
      ),
    );
  });
