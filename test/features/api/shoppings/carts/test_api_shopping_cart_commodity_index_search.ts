import { ArrayUtil, TestValidator } from "@nestia/e2e";
import { randint } from "tstl";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_cart_commodity } from "./internal/generate_random_cart_commodity";
import { prepare_random_cart_commodity } from "./internal/prepare_random_cart_commodity";

export const test_api_shopping_cart_commodity_index_search = async (
  pool: ConnectionPool,
): Promise<void> => {
  //----
  // PREPARE ASSETS
  //----
  // USERS
  await test_api_shopping_actor_seller_join(pool);
  await test_api_shopping_actor_customer_create(pool);

  // SALES AND CART ITEMS
  const sales: IShoppingSale[] = await ArrayUtil.asyncRepeat(REPEAT, () =>
    generate_random_sale(pool),
  );
  const cart: IShoppingCartCommodity[] = await ArrayUtil.asyncMap(
    sales,
    async (s) => {
      const input: IShoppingCartCommodity.ICreate =
        prepare_random_cart_commodity(s);
      input.volume = randint(1, 10);
      for (const stock of input.stocks) stock.quantity = randint(1, 10);
      return generate_random_cart_commodity(pool, s, input);
    },
  );

  // SEARCH VALIDATOR
  const validator = TestValidator.search(
    "search",
    async (input: IShoppingCartCommodity.IRequest.ISearch) => {
      const page: IPage<IShoppingCartCommodity> =
        await ShoppingApi.functional.shoppings.customers.carts.commodities.index(
          pool.customer,
          {
            limit: cart.length,
            search: input,
          },
        );
      return page.data;
    },
    cart,
    5,
  );

  //----
  // DO VALIDATE
  //----
  // PRICE RANGE
  await validator({
    fields: ["min_price", "max_price"],
    values: (commodity) => [
      commodity.price.real * 0.9,
      commodity.price.real * 1.1,
    ],
    filter: (commodity, [min, max]) =>
      min <= commodity.price.real && commodity.price.real <= max,
    request: ([min_price, max_price]) => ({ min_price, max_price }),
  });

  // VOLUME PRICE RANGE
  await validator({
    fields: ["min_volumed_price", "max_volumed_price"],
    values: (commodity) => [
      commodity.price.real * commodity.volume * 0.9,
      commodity.price.real * commodity.volume * 1.1,
    ],
    filter: (commodity, [min_volumed_price, max_volumed_price]) =>
      min_volumed_price <= commodity.price.real * commodity.volume &&
      commodity.price.real * commodity.volume <= max_volumed_price,
    request: ([min_volumed_price, max_volumed_price]) => ({
      min_volumed_price,
      max_volumed_price,
    }),
  });

  // TITLE OF SALE
  await validator({
    fields: ["sale.content.title"],
    values: (commodity) => [commodity.sale.content.title],
    filter: (commodity, [title]) =>
      commodity.sale.content.title.includes(title),
    request: ([title]) => ({ sale: { title } }),
  });

  // SEARCH TAGS OF SALE
  await validator({
    fields: ["tags"],
    values: (commodity) => [commodity.sale.tags],
    request: ([tags]) => ({ sale: { tags } }),
    filter: (commodity, [tags]) =>
      commodity.sale.tags.some((t) => tags.includes(t)),
  });

  // SELLER ID
  await validator({
    fields: ["seller.id"],
    values: (commodity) => [commodity.sale.seller.id],
    request: ([id]) => ({ sale: { seller: { id } } }),
    filter: (commodity, [id]) => commodity.sale.seller.id === id,
  });

  // SELLER NAME
  await validator({
    fields: ["seller.name"],
    values: (commodity) => [commodity.sale.seller.citizen.name],
    request: ([name]) => ({ sale: { seller: { name } } }),
    filter: (commodity, [name]) => commodity.sale.seller.citizen.name === name,
  });

  // SELLER MOBILE
  await validator({
    fields: ["seller.mobile"],
    values: (commodity) => [commodity.sale.seller.citizen.mobile],
    request: ([mobile]) => ({ sale: { seller: { mobile } } }),
    filter: (commodity, [mobile]) =>
      commodity.sale.seller.citizen.mobile === mobile,
  });

  // SELLER EMAIL
  await validator({
    fields: ["seller.email"],
    values: (commodity) => [commodity.sale.seller.member.emails[0].value],
    request: ([email]) => ({ sale: { seller: { email } } }),
    filter: (commodity, [value]) =>
      commodity.sale.seller.member.emails.some((email) =>
        email.value.includes(value),
      ),
  });

  // SELLER NICKNAME
  await validator({
    fields: ["seller.nickname"],
    values: (commodity) => [commodity.sale.seller.member.nickname],
    request: ([nickname]) => ({ sale: { seller: { nickname } } }),
    filter: (commodity, [nickname]) =>
      commodity.sale.seller.member.nickname.includes(nickname),
  });
};

const REPEAT = 25;
