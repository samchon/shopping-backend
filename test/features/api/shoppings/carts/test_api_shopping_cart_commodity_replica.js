"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_cart_commodity_replica = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_create_1 = require("../actors/test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const prepare_random_cart_commodity_1 = require("./internal/prepare_random_cart_commodity");
const test_api_shopping_cart_commodity_replica = async (pool) => {
    await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const input = (0, prepare_random_cart_commodity_1.prepare_random_cart_commodity)(sale);
    const commodity = await index_1.default.functional.shoppings.customers.carts.commodities.create(pool.customer, input);
    const replica = await index_1.default.functional.shoppings.customers.carts.commodities.replica(pool.customer, commodity.id);
    e2e_1.TestValidator.equals("replica", input, replica);
};
exports.test_api_shopping_cart_commodity_replica = test_api_shopping_cart_commodity_replica;
//# sourceMappingURL=test_api_shopping_cart_commodity_replica.js.map