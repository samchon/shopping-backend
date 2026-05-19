"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_review_answer_update = void 0;
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_order_publish_1 = require("../orders/internal/generate_random_order_publish");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_sale_review_1 = require("./internal/generate_random_sale_review");
const validate_api_shopping_sale_inquiry_answer_update_1 = require("./internal/validate_api_shopping_sale_inquiry_answer_update");
const test_api_shopping_sale_review_answer_update = async (pool) => {
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
    const good = order.goods[0];
    const review = await (0, generate_random_sale_review_1.generate_random_sale_review)(pool, sale, good);
    await (0, validate_api_shopping_sale_inquiry_answer_update_1.validate_api_shopping_sale_inquiry_answer_update)({
        read: index_1.default.functional.shoppings.customers.sales.reviews.at,
        create: index_1.default.functional.shoppings.sellers.sales.reviews.answer.create,
        update: index_1.default.functional.shoppings.sellers.sales.reviews.answer.update,
    })(pool, sale, review);
};
exports.test_api_shopping_sale_review_answer_update = test_api_shopping_sale_review_answer_update;
//# sourceMappingURL=test_api_shopping_sale_review_answer_update.js.map