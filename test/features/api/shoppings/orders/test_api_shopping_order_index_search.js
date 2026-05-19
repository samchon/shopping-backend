"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_index_search = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_order_1 = require("./internal/generate_random_order");
const generate_random_order_publish_1 = require("./internal/generate_random_order_publish");
const test_api_shopping_order_index_search = async (pool) => {
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
    const validator = e2e_1.TestValidator.search("search orders", async (input) => {
        const page = await index_1.default.functional.shoppings.customers.orders.index(pool.customer, {
            search: input,
            sort: ["-order.created_at"],
            limit: orderList.length,
        });
        return page.data;
    }, orderList, 2);
    await validator({
        fields: ["paid"],
        values: () => [true],
        filter: (order) => order.publish !== null && order.publish.paid_at !== null,
        request: () => ({ paid: true }),
    });
    await validator({
        fields: ["paid"],
        values: () => [false],
        filter: (order) => order.publish === null || order.publish.paid_at === null,
        request: () => ({ paid: false }),
    });
    await validator({
        fields: ["min_price", "max_price"],
        values: (order) => [order.price.real * 0.9, order.price.real * 1.1],
        filter: (order, [min, max]) => min <= order.price.real && order.price.real <= max,
        request: ([min_price, max_price]) => ({
            min_price,
            max_price,
            paid: null,
        }),
    });
    await validator({
        fields: ["sale.content.title"],
        values: (order) => [order.goods[0].commodity.sale.content.title],
        filter: (order, [title]) => order.goods.some((good) => good.commodity.sale.content.title.includes(title)),
        request: ([title]) => ({
            sale: {
                title,
            },
        }),
    });
    await validator({
        fields: ["seller.name"],
        values: (order) => [order.goods[0].commodity.sale.seller.citizen.name],
        filter: (order, [name]) => order.goods.some((good) => good.commodity.sale.seller.citizen.name === name),
        request: ([name]) => ({
            sale: {
                seller: {
                    name,
                },
            },
        }),
    });
};
exports.test_api_shopping_order_index_search = test_api_shopping_order_index_search;
const REPEAT = 25;
//# sourceMappingURL=test_api_shopping_order_index_search.js.map