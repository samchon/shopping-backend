"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_index_of_seller = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const TestGlobal_1 = require("../../../../TestGlobal");
const test_api_shopping_actor_customer_create_1 = require("../actors/test_api_shopping_actor_customer_create");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_order_1 = require("./internal/generate_random_order");
const generate_random_order_publish_1 = require("./internal/generate_random_order_publish");
const test_api_shopping_order_index_of_seller = async (pool) => {
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const groups = await e2e_1.ArrayUtil.asyncRepeat(REPEAT, async () => {
        const seller = await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
        const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
        return { seller, sale, orders: [] };
    });
    await e2e_1.ArrayUtil.asyncRepeat(groups.length, async (i) => {
        const commodities = await e2e_1.ArrayUtil.asyncMap(groups.filter((_, j) => i !== j), (g) => (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, g.sale));
        const order = await (0, generate_random_order_1.generate_random_order)(pool, commodities);
        order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
        groups.forEach((g, j) => {
            if (i !== j)
                g.orders.push(order);
        });
    });
    for (const { seller, orders } of groups) {
        await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool, pool.seller);
        await index_1.default.functional.shoppings.sellers.authenticate.login(pool.seller, {
            email: seller.member.emails[0].value,
            password: TestGlobal_1.TestGlobal.PASSWORD,
        });
        const page = await index_1.default.functional.shoppings.sellers.orders.index(pool.seller, {
            limit: groups.length,
        });
        e2e_1.TestValidator.index("page", orders, page.data);
        e2e_1.TestValidator.predicate("ownership", () => page.data.every((order) => order.goods.every((good) => good.commodity.sale.seller.id === seller.id)));
    }
};
exports.test_api_shopping_order_index_of_seller = test_api_shopping_order_index_of_seller;
const REPEAT = 4;
//# sourceMappingURL=test_api_shopping_order_index_of_seller.js.map