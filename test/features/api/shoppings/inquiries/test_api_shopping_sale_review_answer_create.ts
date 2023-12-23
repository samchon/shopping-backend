import ShoppingApi from "@samchon/shopping-api/lib/index";
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
import { validate_api_shopping_sale_inquiry_answer_create } from "./internal/validate_api_shopping_sale_inquiry_answer_create";

export const test_api_shopping_sale_review_answer_create = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_seller_join(pool);
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);

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
  await validate_api_shopping_sale_inquiry_answer_create({
    read: ShoppingApi.functional.shoppings.customers.sales.reviews.at,
    create:
      ShoppingApi.functional.shoppings.sellers.sales.reviews.answer.create,
  })(pool, sale, review);
};
