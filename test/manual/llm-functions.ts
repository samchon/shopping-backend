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
import { IShoppingDepositCharge } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositCharge";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";
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
import { prepare_random_cart_commodity } from "../features/api/shoppings/carts/internal/prepare_random_cart_commodity";
import { prepare_random_address } from "../features/api/shoppings/orders/internal/prepare_random_address";

interface IFunctionCall {
  name: string;
  method: string;
  path: string;
  description?: string;
  parameters: object;
  output?: object | undefined;
  success: boolean;
  arguments: object;
  value: any;
}

const main = async (): Promise<void> => {
  //----
  // PREPARE ASSETS
  //----
  // RESET DATABASE
  ShoppingGlobal.testing = true;
  if (process.argv.includes("--skipBuild") === false) {
    await ShoppingSetupWizard.schema(ShoppingGlobal.prisma);
    await ShoppingSetupWizard.seed();
  }

  // GET LLM APPLICATION
  const application: IHttpLlmApplication<"claude"> = HttpLlm.application({
    model: "claude",
    document: await (async () => {
      const location: string = `${ShoppingConfiguration.ROOT}/packages/api/swagger.json`;
      if (fs.existsSync(location) === false)
        cp.execSync("npm run build:swagger", {
          cwd: ShoppingConfiguration.ROOT,
          stdio: "ignore",
        });
      return JSON.parse(await fs.readFileSync(location, "utf8"));
    })(),
  });
  await fs.promises.writeFile(
    `${ShoppingConfiguration.ROOT}/assets/llm-application.json`,
    JSON.stringify(application, null, 2),
    "utf8",
  );

  // THE API EXECUTOR
  const histories: IFunctionCall[] = [];
  const execute = async <
    Operation extends ((
      connection: ShoppingApi.IConnection,
      ...args: any[]
    ) => Promise<unknown>) & {
      METADATA: {
        method: string;
        path: string;
      };
    },
  >(
    operation: Operation,
    ...args: Parameters<Operation>
  ): Promise<ReturnType<Operation>> => {
    const schema: IHttpLlmFunction<"claude"> | undefined =
      application.functions.find(
        (f) =>
          f.method === operation.METADATA.method.toLowerCase() &&
          "/" + f.route().emendedPath === operation.METADATA.path,
      );
    if (schema === undefined)
      throw new Error(
        `Function not found: ${operation.METADATA.method} ${operation.METADATA.path}`,
      );
    console.log(operation.METADATA.method, operation.METADATA.path);
    const value: ReturnType<Operation> = await (operation as any)(...args);
    histories.push({
      name: schema.name,
      method: schema.method,
      path: schema.path,
      description: schema.description,
      parameters: schema.parameters,
      output: schema.output,
      success: true,
      arguments: Object.fromEntries(
        Object.keys(schema.parameters).map((key, i) => [key, args[i]]),
      ),
      value,
    });
    return value;
  };

  // OPEN BACKEND SERVER
  const backend: ShoppingBackend = new ShoppingBackend();
  await backend.open();
  const pool: ConnectionPool = new ConnectionPool({
    host: `http://127.0.0.1:${ShoppingConfiguration.API_PORT()}`,
  });

  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_customer_create(pool, pool.seller);
  await ShoppingApi.functional.shoppings.sellers.authenticate.login(
    pool.seller,
    {
      email: "robot@nestia.io",
      password: ShoppingGlobal.env.SHOPPING_SYSTEM_PASSWORD,
    },
  );

  //----
  // COIN SCENARIO
  //----
  // DEPOSIT CHARGING
  const charge: IShoppingDepositCharge = await execute(
    ShoppingApi.functional.shoppings.customers.deposits.charges.create,
    pool.customer,
    {
      value: 200_000,
    },
  );
  await execute(
    ShoppingApi.functional.shoppings.customers.deposits.charges.publish.create,
    pool.customer,
    charge.id,
    {
      vendor: "Shinhan Bank",
      uid: v4(),
    },
  );

  //----
  // ORDER SCENARIO
  //----
  // FIND SURFACE PRO FROM THE SALE LIST
  const page: IPage<IShoppingSale.ISummary> = await execute(
    ShoppingApi.functional.shoppings.customers.sales.index,
    pool.customer,
    {
      limit: 100,
    },
  );

  // READ THE DETAILED SALE
  const sales: IShoppingSale[] = await ArrayUtil.asyncMap(
    RandomGenerator.sample(page.data)(4),
  )(
    async (sale) =>
      await execute(
        ShoppingApi.functional.shoppings.customers.sales.at,
        pool.customer,
        sale.id,
      ),
  );

  // COMPOSE SHOPPING CART
  const commodities: IShoppingCartCommodity[] = await ArrayUtil.asyncMap(sales)(
    async (s) =>
      await execute(
        ShoppingApi.functional.shoppings.customers.carts.commodities.create,
        pool.customer,
        prepare_random_cart_commodity(s),
      ),
  );

  // START ORDER REQUEST
  const order: IShoppingOrder = await execute(
    ShoppingApi.functional.shoppings.customers.orders.create,
    pool.customer,
    {
      goods: commodities.map((c) => ({
        commodity_id: c.id,
        volume: c.volume,
      })),
    },
  );

  // ADJUST DISCOUNT INFO
  await execute(
    ShoppingApi.functional.shoppings.admins.coupons.create,
    pool.admin,
    {
      name: "10% Discount for every sales",
      opened_at: new Date().toISOString(),
      closed_at: null,
      disposable_codes: [],
      discount: {
        unit: "percent",
        value: 10,
        threshold: null,
        limit: null,
      },
      restriction: {
        access: "public",
        volume: 10_000,
        volume_per_citizen: 5,
        exclusive: true,
        expired_in: 15,
        expired_at: null,
      },
      criterias: [
        {
          type: "channel",
          direction: "include",
          channels: [
            {
              channel_code: customer.channel.code,
              category_ids: null,
            },
          ],
        },
      ],
    },
  );
  const discountable: IShoppingOrderDiscountable = await execute(
    ShoppingApi.functional.shoppings.customers.orders.discountable,
    pool.customer,
    order.id,
    {
      good_ids: null,
    },
  );
  await execute(
    ShoppingApi.functional.shoppings.customers.orders.discount,
    pool.customer,
    order.id,
    {
      deposit: discountable.deposit,
      mileage: discountable.mileage,
      coupon_ids:
        discountable.combinations.at(0)?.coupons.map((c) => c.id) ?? [],
    },
  );

  // DO PUBLISH THE ORDER
  const publish: IShoppingOrderPublish = await execute(
    ShoppingApi.functional.shoppings.customers.orders.publish.create,
    pool.customer,
    order.id,
    {
      vendor: {
        code: "Shinhan Bank",
        uid: v4(),
      },
      address: prepare_random_address(customer.citizen!),
    },
  );

  //----
  // DELIVERY SCENARIO
  //----
  // CREATE DELIVERY STATUS
  await execute(
    ShoppingApi.functional.shoppings.sellers.deliveries.create,
    pool.seller,
    {
      shippers: [
        {
          company: "Korea Post",
          name: "Kildong Hong",
          mobile: RandomGenerator.mobile(),
        },
      ],
      pieces:
        await ShoppingApi.functional.shoppings.sellers.deliveries.incompletes(
          pool.seller,
          {
            publish_ids: [publish.id],
          },
        ),
      journeys: (["preparing", "manufacturing", "delivering"] as const).map(
        (type) => ({
          type,
          title: null,
          description: null,
          started_at: new Date().toISOString(),
          completed_at: null,
        }),
      ),
    },
  );

  // AND READ IT
  await execute(
    ShoppingApi.functional.shoppings.customers.orders.at,
    pool.customer,
    order.id,
  );

  // REPORT
  await fs.promises.writeFile(
    `${ShoppingConfiguration.ROOT}/assets/llm-function-calls.json`,
    JSON.stringify(histories, null, 2),
    "utf8",
  );
  await backend.close();
};
main().catch((exp) => {
  console.error(exp);
  process.exit(-1);
});
