"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_delivery_journey_complete = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_order_publish_1 = require("../orders/internal/generate_random_order_publish");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const test_api_shopping_delivery_journey_complete = async (pool) => {
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
    const delivery = await index_1.default.functional.shoppings.sellers.deliveries.create(pool.seller, {
        shippers: [],
        pieces: await index_1.default.functional.shoppings.sellers.deliveries.incompletes(pool.seller, {
            publish_ids: [order.publish.id],
        }),
        journeys: ["preparing", "manufacturing", "delivering"].map((type) => ({
            type,
            title: null,
            description: null,
            started_at: new Date().toISOString(),
            completed_at: null,
        })),
    });
    e2e_1.TestValidator.equals("state", delivery.state, "delivering");
    await index_1.default.functional.shoppings.sellers.deliveries.journeys.complete(pool.seller, delivery.id, delivery.journeys[0].id, {
        completed_at: new Date().toISOString(),
    });
    const read = await index_1.default.functional.shoppings.sellers.deliveries.at(pool.seller, delivery.id);
    e2e_1.TestValidator.equals("completed", !!read.journeys[0].completed_at, true);
    e2e_1.TestValidator.equals("changed state", read.state, "delivering");
};
exports.test_api_shopping_delivery_journey_complete = test_api_shopping_delivery_journey_complete;
//# sourceMappingURL=test_api_shopping_delivery_journey_complete.js.map