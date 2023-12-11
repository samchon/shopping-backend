import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderGood } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderGood";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ShoppingConfiguration } from "../../../../../src/ShoppingConfiguration";
import { ConnectionPool } from "../../../../ConnectionPool";
import { prepare_random_attachment_file } from "../../common/internal/prepare_random_attachment_file";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_order_publish } from "../orders/internal/generate_random_order_publish";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_review } from "../sales/internal/generate_random_sale_review";

export const test_api_shopping_mileage_income_by_review_of_photo = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_seller_join(pool);
  const customer: IShoppingCustomer = await test_api_shopping_customer_join(
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
  await generate_random_sale_review(pool, sale, good, {
    files: [prepare_random_attachment_file({ extension: "jpg" })],
  });

  const balance: number =
    await ShoppingApi.functional.shoppings.customers.mileages.histories.balance(
      pool.customer,
    );
  TestValidator.equals("balance")(balance)(
    ShoppingConfiguration.MILEAGE_REWARDS.PHOTO_REVIEW,
  );
};
