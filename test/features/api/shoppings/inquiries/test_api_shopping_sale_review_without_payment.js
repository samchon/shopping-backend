"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_review_without_payment = void 0;
const e2e_1 = require("@nestia/e2e");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_order_publish_1 = require("../orders/internal/generate_random_order_publish");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_sale_review_1 = require("./internal/generate_random_sale_review");
const test_api_shopping_sale_review_without_payment = async (pool) => {
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    const good = order.goods[0];
    await e2e_1.TestValidator.httpError("not ordered", 422, () => (0, generate_random_sale_review_1.generate_random_sale_review)(pool, sale, good));
    order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, false);
    await e2e_1.TestValidator.httpError("not paid", 422, () => (0, generate_random_sale_review_1.generate_random_sale_review)(pool, sale, good));
};
exports.test_api_shopping_sale_review_without_payment = test_api_shopping_sale_review_without_payment;
//# sourceMappingURL=test_api_shopping_sale_review_without_payment.js.map