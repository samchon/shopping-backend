import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderGood } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderGood";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleReview } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleReview";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_order_publish } from "../orders/internal/generate_random_order_publish";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_review } from "./internal/generate_random_sale_review";

export const test_api_shopping_sale_review_create = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_seller_join(pool);
  const customer: IShoppingCustomer = await test_api_shopping_actor_customer_join(
    pool,
  );

  const sale: IShoppingSale = await generate_random_sale(pool);
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale);
  const order: IShoppingOrder = await generate_random_order(pool, [commodity]);
  order.publish = await generate_random_order_publish(
    pool,
    customer,
    order,
    true,
  );

  const good: IShoppingOrderGood = order.goods[0];
  const review: IShoppingSaleReview = await generate_random_sale_review(
    pool,
    sale,
    good,
  );

  const read: IShoppingSaleReview =
    await ShoppingApi.functional.shoppings.customers.sales.reviews.at(
      pool.customer,
      sale.id,
      review.id,
    );
  typia.assertEquals(read);
  TestValidator.equals("read")(review)(read);

  const page: IPage<IShoppingSaleReview.ISummary> =
    await ShoppingApi.functional.shoppings.customers.sales.reviews.index(
      pool.customer,
      sale.id,
      {
        limit: 1,
      },
    );
  typia.assertEquals(page);
  TestValidator.equals("page")(review.id)(page.data[0].id);
};
