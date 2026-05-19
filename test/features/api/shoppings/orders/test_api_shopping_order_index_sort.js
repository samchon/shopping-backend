"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_index_sort = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_order_1 = require("./internal/generate_random_order");
const generate_random_order_publish_1 = require("./internal/generate_random_order_publish");
const test_api_shopping_order_index_sort = async (pool) => {
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const orderList = await e2e_1.ArrayUtil.asyncRepeat(REPEAT, async () => {
        await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
        const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
        const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
        const order = await (0, generate_random_order_1.generate_random_order)(pool, [
            commodity,
        ]);
        order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
        return order;
    });
    const validator = e2e_1.TestValidator.sort("sort orders", async (input) => {
        const page = await index_1.default.functional.shoppings.customers.orders.index(pool.customer, {
            sort: input,
            limit: orderList.length,
        });
        return page.data;
    });
    const components = [
        validator("order.price")(e2e_1.GaffComparator.numbers((x) => x.price.real)),
        validator("order.quantity")(e2e_1.GaffComparator.numbers((x) => x.goods.map((oi) => oi.volume *
            oi.commodity.sale.units
                .map((u) => u.stocks.map((s) => s.quantity).reduce((x, y) => x + y))
                .reduce((x, y) => x + y)))),
        validator("order.created_at")(e2e_1.GaffComparator.dates((x) => x.created_at)),
        validator("order.publish.paid_at")(e2e_1.GaffComparator.dates((x) => x.publish?.paid_at ?? "9999-12-31 09:00:00")),
    ];
    for (const comp of components) {
        await comp("+");
        await comp("-");
    }
};
exports.test_api_shopping_order_index_sort = test_api_shopping_order_index_sort;
const REPEAT = 25;
//# sourceMappingURL=test_api_shopping_order_index_sort.js.map