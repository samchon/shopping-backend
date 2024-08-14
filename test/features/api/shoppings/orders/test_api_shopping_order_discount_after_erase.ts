import { ArrayUtil, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";

import { generate_random_order } from "./internal/generate_random_order";
import { validate_api_shopping_order_discountable } from "./internal/validate_api_shopping_order_discountable";

export const test_api_shopping_order_discount_after_erase =
  validate_api_shopping_order_discountable(async (pool, props) => {
    const combination: IShoppingOrderDiscountable.ICombination =
      props.discountable.combinations[0];
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

    const order: IShoppingOrder = await generate_random_order(
      pool,
      commodities,
    );

    const discount = async (order: IShoppingOrder) => {
      const price =
        await ShoppingApi.functional.shoppings.customers.orders.discount(
          pool.customer,
          order.id,
          {
            deposit: 0,
            mileage: 0,
            coupon_ids: combination.coupons.map((coupon) => coupon.id),
          },
        );
      return price;
    };

    const price: IShoppingOrderPrice = await discount(props.order);
    await ShoppingApi.functional.shoppings.customers.orders.erase(
      pool.customer,
      props.order.id,
    );

    const retry: IShoppingOrderPrice = await discount(order);
    TestValidator.equals("coupons")(
      price.ticket_payments
        .map((tp) => tp.ticket.coupon)
        .sort((x, y) => x.id.localeCompare(y.id)),
    )(
      retry.ticket_payments
        .map((tp) => tp.ticket.coupon)
        .sort((x, y) => x.id.localeCompare(y.id)),
    );
  });
