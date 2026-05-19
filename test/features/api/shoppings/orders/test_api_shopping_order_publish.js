"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_publish = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_order_1 = require("./internal/generate_random_order");
const generate_random_order_publish_1 = require("./internal/generate_random_order_publish");
const test_api_shopping_order_publish = async (pool) => {
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
    for (const actor of ["admin", "customer", "seller"]) {
        const read = await index_1.default.functional.shoppings[`${actor}s`].orders.at(pool[actor], order.id);
        e2e_1.TestValidator.equals("read", order, read, (key) => key === "orderable" || key === "inventory" || key === "state");
    }
};
exports.test_api_shopping_order_publish = test_api_shopping_order_publish;
//# sourceMappingURL=test_api_shopping_order_publish.js.map