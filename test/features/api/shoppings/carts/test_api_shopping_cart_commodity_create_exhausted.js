"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_cart_commodity_create_exhausted = void 0;
const e2e_1 = require("@nestia/e2e");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_order_publish_1 = require("../orders/internal/generate_random_order_publish");
const generate_random_sole_sale_1 = require("../sales/internal/generate_random_sole_sale");
const test_api_shopping_cart_commodity_create_exhausted = async (pool) => {
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sole_sale_1.generate_random_sole_sale)(pool, {
        nominal: 10_000,
        real: 10_000,
    }, 1);
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale, { volume: 1 });
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
    await e2e_1.TestValidator.httpError("exhausted", 422, () => (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale, { volume: 1 }));
};
exports.test_api_shopping_cart_commodity_create_exhausted = test_api_shopping_cart_commodity_create_exhausted;
//# sourceMappingURL=test_api_shopping_cart_commodity_create_exhausted.js.map