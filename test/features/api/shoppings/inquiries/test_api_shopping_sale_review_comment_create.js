"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_review_comment_create = void 0;
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_order_publish_1 = require("../orders/internal/generate_random_order_publish");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_sale_review_1 = require("./internal/generate_random_sale_review");
const validate_api_shopping_sale_inquiry_comment_create_1 = require("./internal/validate_api_shopping_sale_inquiry_comment_create");
const test_api_shopping_sale_review_comment_create = async (pool) => {
    const admin = await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const seller = await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
    const good = order.goods[0];
    const review = await (0, generate_random_sale_review_1.generate_random_sale_review)(pool, sale, good);
    await (0, validate_api_shopping_sale_inquiry_comment_create_1.validate_api_shopping_sale_inquiry_comment_create)(pool, admin, customer, seller, sale, review);
};
exports.test_api_shopping_sale_review_comment_create = test_api_shopping_sale_review_comment_create;
//# sourceMappingURL=test_api_shopping_sale_review_comment_create.js.map