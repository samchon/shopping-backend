import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { TestGlobal } from "../../../../TestGlobal";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_order } from "./internal/generate_random_order";
import { generate_random_order_publish } from "./internal/generate_random_order_publish";

export const test_api_shopping_order_index_of_seller = async (
  pool: ConnectionPool,
): Promise<void> => {
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);
  const groups: IGroup[] = await ArrayUtil.asyncRepeat(REPEAT)(async () => {
    const seller = await test_api_shopping_actor_seller_join(pool);
    const sale = await generate_random_sale(pool);
    return { seller, sale, orders: [] };
  });

  await ArrayUtil.asyncRepeat(groups.length)(async (i) => {
    // MAKE A NEW CART AND ORDER
    const commodities: IShoppingCartCommodity[] = await ArrayUtil.asyncMap(
      groups.filter((_, j) => i !== j),
    )((g) => generate_random_cart_commodity(pool, g.sale));
    const order: IShoppingOrder = await generate_random_order(
      pool,
      commodities,
    );
    order.publish = await generate_random_order_publish(
      pool,
      customer,
      order,
      true,
    );

    // ENROLL FOR INDEX VALIDATION
    groups.forEach((g, j) => {
      if (i !== j) g.orders.push(order);
    });
  });

  for (const { seller, orders } of groups) {
    await test_api_shopping_actor_customer_create(pool, pool.seller);
    await ShoppingApi.functional.shoppings.sellers.authenticate.login(
      pool.seller,
      {
        email: seller.member.emails[0].value,
        password: TestGlobal.PASSWORD,
      },
    );

    const page: IPage<IShoppingOrder> =
      await ShoppingApi.functional.shoppings.sellers.orders.index(pool.seller, {
        limit: groups.length,
      });
    typia.assertEquals(page);

    TestValidator.index("page")(orders)(page.data);
    TestValidator.predicate("ownership")(() =>
      page.data.every((order) =>
        order.goods.every(
          (good) => good.commodity.sale.seller.id === seller.id,
        ),
      ),
    );
  }
};

interface IGroup {
  seller: IShoppingSeller.IInvert;
  sale: IShoppingSale;
  orders: IShoppingOrder[];
}

const REPEAT = 4;
