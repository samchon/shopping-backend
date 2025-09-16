import { ArrayUtil, RandomGenerator } from "@nestia/e2e";
import {
  HttpLlm,
  IHttpLlmApplication,
  IHttpLlmFunction,
} from "@samchon/openapi";
import cp from "child_process";
import fs from "fs";
import { v4 } from "uuid";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingDepositCharge } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositCharge";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingCartCommodityStock } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodityStock";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderPublish } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPublish";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ShoppingBackend } from "../../src/ShoppingBackend";
import { ShoppingConfiguration } from "../../src/ShoppingConfiguration";
import { ShoppingGlobal } from "../../src/ShoppingGlobal";
import { ShoppingSetupWizard } from "../../src/setup/ShoppingSetupWizard";
import { ConnectionPool } from "../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../features/api/shoppings/actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_create } from "../features/api/shoppings/actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_customer_join } from "../features/api/shoppings/actors/test_api_shopping_actor_customer_join";
import { generate_random_cart_commodity } from "../features/api/shoppings/carts/internal/generate_random_cart_commodity";
import { prepare_random_coupon } from "../features/api/shoppings/coupons/internal/prepare_random_coupon";
import { generate_random_order } from "../features/api/shoppings/orders/internal/generate_random_order";
import { generate_random_order_publish } from "../features/api/shoppings/orders/internal/generate_random_order_publish";
import { prepare_random_address } from "../features/api/shoppings/orders/internal/prepare_random_address";
import { ArgumentParser } from "../internal/ArgumentParser";
import { StopWatch } from "../internal/StopWatch";

interface IOptions {
  swagger: boolean;
}
interface OperationMetadata {
  method: string;
  path: string;
}
interface FetchFunction<Args extends unknown[], Value> {
  (connection: ShoppingApi.IConnection, ...args: Args): Promise<Value>;
  METADATA: OperationMetadata;
}

const getOptions = () =>
  ArgumentParser.parse<IOptions>(async (command, prompt, action) => {
    command.option("--reset <true|false>", "reset local DB or not");
    command.option(
      "--simultaneous <number>",
      "number of simultaneous requests",
    );
    command.option("--include <string...>", "include feature files");
    command.option("--exclude <string...>", "exclude feature files");
    command.option("--trace <boolean>", "trace detailed errors");

    return action(async (options) => {
      if (typeof options.swagger === "string")
        options.swagger = options.swagger === "true";
      options.swagger ??= await prompt.boolean("swagger")("Generate Swagger");
      return options as IOptions;
    });
  });

const main = async (): Promise<void> => {
  const options: IOptions = await getOptions();

  //----
  // PREPARATIONS
  //----
  // COMPOSE APPLICATION
  if (options.swagger)
    cp.execSync("npm run build:swagger", {
      stdio: "inherit",
      cwd: ShoppingConfiguration.ROOT,
    });
  const application: IHttpLlmApplication<"chatgpt"> = HttpLlm.application({
    model: "chatgpt",
    document: JSON.parse(
      await fs.promises.readFile(
        `${ShoppingConfiguration.ROOT}/packages/api/swagger.json`,
        "utf8",
      ),
    ),
    options: {
      reference: true,
    },
  });
  const execute =
    <Args extends unknown[], Value>(
      func: ((
        connection: ShoppingApi.IConnection,
        ...args: Args
      ) => Promise<Value>) & {
        METADATA: OperationMetadata;
      },
    ) =>
    async (
      connection: ShoppingApi.IConnection,
      ...args: Args
    ): Promise<Value> => {
      const metadata: IHttpLlmFunction<"chatgpt"> | undefined =
        application.functions.find(
          (y) =>
            y.method === func.METADATA.method.toLowerCase() &&
            (y.route().emendedPath.startsWith("/")
              ? y.route().emendedPath
              : `/${y.route().emendedPath}`) === func.METADATA.path,
        );
      if (metadata === undefined)
        throw new Error(
          `Unable to find the matched operation (${func.METADATA.method} ${func.METADATA.path})`,
        );
      const value: Value = await func(connection, ...args);
      await fs.promises.writeFile(
        `${ShoppingConfiguration.ROOT}/assets/examples/${metadata.name}.json`,
        JSON.stringify({
          function: metadata,
          arguments: {
            ...Object.fromEntries(
              metadata.route().parameters.map((p, i) => [p.key, args[i]]),
            ),
            query: metadata.route().query
              ? args[metadata.route().parameters.length]
              : undefined,
            body: metadata.route().body
              ? args[
                  metadata.route().parameters.length +
                    (metadata.route().query ? 1 : 0)
                ]
              : undefined,
          },
          value,
        }),
        "utf8",
      );
      return value;
    };
  try {
    await fs.promises.mkdir(`${ShoppingConfiguration.ROOT}/assets/examples`, {
      recursive: true,
    });
  } catch {}

  // DATABASE SETUP
  ShoppingGlobal.testing = true;
  await StopWatch.trace("Reset DB")(ShoppingSetupWizard.schema);
  await StopWatch.trace("Seed Data")(ShoppingSetupWizard.seed);

  // OPEN BACKEND SERVER
  const pool: ConnectionPool = new ConnectionPool(
    {
      host: `http://localhost:${ShoppingConfiguration.API_PORT()}`,
    },
    (await ShoppingGlobal.prisma.shopping_channels.findFirstOrThrow()).code,
  );
  const backend: ShoppingBackend = new ShoppingBackend();
  await backend.open();

  // CUSTOMER
  const customer = await test_api_shopping_actor_customer_join(
    pool,
    pool.customer,
    {
      nickname: "JohnDoe94",
      citizen: {
        mobile: "821012345678",
        name: "John Doe",
      },
    },
  );

  // ADMIN & SELLER
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_customer_create(pool, pool.seller);

  const seller: IShoppingSeller.IInvert =
    await ShoppingApi.functional.shoppings.sellers.authenticate.login(
      pool.seller,
      {
        email: "robot@nestia.io",
        password: ShoppingGlobal.env.SHOPPING_SYSTEM_PASSWORD,
      },
    );

  //----
  // MAIN SCENARIOS
  //----
  const salePage: IPage<IShoppingSale.ISummary> = await execute(
    ShoppingApi.functional.shoppings.customers.sales.index,
  )(pool.customer, {
    limit: 0,
  });

  // ORDER
  {
    const sale: IShoppingSale = await execute(
      ShoppingApi.functional.shoppings.customers.sales.at,
    )(
      pool.customer,
      salePage.data.find((sale) =>
        sale.content.title.toLowerCase().includes("macbook"),
      )!.id,
    );
    const commodity: IShoppingCartCommodity = await execute(
      ShoppingApi.functional.shoppings.customers.carts.commodities.create,
    )(pool.customer, {
      sale_id: sale.id,
      stocks: sale.units.map(
        (unit) =>
          ({
            unit_id: unit.id,
            stock_id: RandomGenerator.pick(unit.stocks).id,
            choices: [],
            quantity: 1,
          }) satisfies IShoppingCartCommodityStock.ICreate,
      ),
      volume: 1,
    });
    const order: IShoppingOrder = await execute(
      ShoppingApi.functional.shoppings.customers.orders.create,
    )(pool.customer, {
      goods: [
        {
          commodity_id: commodity.id,
          volume: 1,
        },
      ],
    } satisfies IShoppingOrder.ICreate);
    order.publish = await execute(
      ShoppingApi.functional.shoppings.customers.orders.publish.create,
    )(pool.customer, order.id, {
      address: prepare_random_address(customer.citizen!),
      vendor: {
        code: "somewhere",
        uid: v4(),
      },
    } satisfies IShoppingOrderPublish.ICreate);
  }

  // DEPOSIT
  {
    const charge = async (
      value: number,
      archive: boolean = false,
    ): Promise<void> => {
      const process = <Args extends unknown[], Value>(
        func: FetchFunction<Args, Value>,
      ) => (archive ? execute(func) : func);

      const charge: IShoppingDepositCharge = await process(
        ShoppingApi.functional.shoppings.customers.deposits.charges.create,
      )(pool.customer, {
        value,
      });
      charge.publish = await process(
        ShoppingApi.functional.shoppings.customers.deposits.charges.publish
          .create,
      )(pool.customer, charge.id, {
        vendor: "somewhere",
        uid: v4(),
      });
    };
    const consume = async (value: number): Promise<void> => {
      const sale: IShoppingSale =
        await ShoppingApi.functional.shoppings.customers.sales.at(
          pool.customer,
          RandomGenerator.pick(salePage.data).id,
        );
      const commodity: IShoppingCartCommodity =
        await generate_random_cart_commodity(pool, sale);
      const order: IShoppingOrder = await generate_random_order(pool, [
        commodity,
      ]);
      await ShoppingApi.functional.shoppings.customers.orders.discount(
        pool.customer,
        order.id,
        {
          coupon_ids: [],
          deposit: value,
          mileage: 0,
        },
      );
      await generate_random_order_publish(pool, customer, order, true);
    };

    await charge(100_000, true);
    await consume(50_000);
    await consume(4_000);
    await consume(9_000);
    await consume(20_000);
    await consume(10_000);
    await charge(70_000);
    await consume(35_000);
    await consume(10_000);

    await execute(
      ShoppingApi.functional.shoppings.customers.deposits.histories.index,
    )(pool.customer, {
      limit: 0,
      sort: ["+history.created_at"],
    });
  }

  // DISCOUNTABLE
  {
    const generator =
      (exclusive: boolean) =>
      async (
        criteria: IShoppingCouponCriteria.ICreate | null,
      ): Promise<IShoppingCoupon> => {
        const coupon: IShoppingCoupon =
          await ShoppingApi.functional.shoppings.admins.coupons.create(
            pool.admin,
            prepare_random_coupon({
              restriction: {
                exclusive,
                volume: null,
                volume_per_citizen: null,
              },
              discount: {
                unit: "amount",
                value: 5_000,
                multiplicative: false,
                threshold: null,
              },
              criterias: [...(criteria ? [criteria] : [])],
            }),
          );
        return coupon;
      };
    const saleList: IShoppingSale.ISummary[] = RandomGenerator.sample(
      salePage.data,
      3,
    );

    await generator(true)(null);
    await generator(false)({
      type: "sale",
      direction: "include",
      sale_ids: [saleList[0].id],
    });
    await generator(false)({
      type: "seller",
      direction: "include",
      seller_ids: [seller.id],
    });
    await generator(false)({
      type: "section",
      direction: "include",
      section_codes: [saleList[0].section.code],
    });

    const commodities: IShoppingCartCommodity[] = await ArrayUtil.asyncMap(
      RandomGenerator.sample(salePage.data, 3),
      async (summary) => {
        const sale: IShoppingSale =
          await ShoppingApi.functional.shoppings.customers.sales.at(
            pool.customer,
            summary.id,
          );
        return generate_random_cart_commodity(pool, sale);
      },
    );
    await execute(
      ShoppingApi.functional.shoppings.customers.carts.commodities.discountable,
    )(pool.customer, {
      commodity_ids: commodities.map((commodity) => commodity.id),
      pseudos: [],
    });
  }

  // IN THE SELLER VIEW
  {
    await ArrayUtil.asyncRepeat(10, async () => {
      const customer: IShoppingCustomer =
        await test_api_shopping_actor_customer_join(pool);
      const sale: IShoppingSale =
        await ShoppingApi.functional.shoppings.customers.sales.at(
          pool.customer,
          RandomGenerator.pick(salePage.data).id,
        );
      const commodity: IShoppingCartCommodity =
        await generate_random_cart_commodity(pool, sale);
      const order: IShoppingOrder = await generate_random_order(pool, [
        commodity,
      ]);
      order.publish = await generate_random_order_publish(
        pool,
        customer,
        order,
        true,
      );
    });
    await execute(ShoppingApi.functional.shoppings.sellers.orders.index)(
      pool.seller,
      {
        limit: 0,
        sort: ["+order.created_at"],
      },
    );
  }

  // TERMINATE
  await backend.close();
};
main().catch((error) => {
  console.log(error);
  process.exit(-1);
});
