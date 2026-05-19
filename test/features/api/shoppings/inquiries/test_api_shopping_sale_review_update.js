"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_review_update = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const prepare_random_bbs_article_1 = require("../../common/internal/prepare_random_bbs_article");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_order_publish_1 = require("../orders/internal/generate_random_order_publish");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_sale_review_1 = require("./internal/generate_random_sale_review");
const test_api_shopping_sale_review_update = async (pool) => {
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
    const good = order.goods[0];
    const review = await (0, generate_random_sale_review_1.generate_random_sale_review)(pool, sale, good);
    review.snapshots.push(...(await e2e_1.ArrayUtil.asyncRepeat(4, async () => {
        const snapshot = await index_1.default.functional.shoppings.customers.sales.reviews.update(pool.customer, sale.id, review.id, {
            ...(0, prepare_random_bbs_article_1.prepare_random_bbs_article)(),
            score: (0, tstl_1.randint)(0, 10) * 10,
        });
        return snapshot;
    })));
    const read = await index_1.default.functional.shoppings.customers.sales.reviews.at(pool.customer, sale.id, review.id);
    e2e_1.TestValidator.equals("read", review, read);
};
exports.test_api_shopping_sale_review_update = test_api_shopping_sale_review_update;
//# sourceMappingURL=test_api_shopping_sale_review_update.js.map