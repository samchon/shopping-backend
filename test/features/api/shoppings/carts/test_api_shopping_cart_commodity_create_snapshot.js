"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_cart_commodity_create_snapshot = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_create_1 = require("../actors/test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const prepare_random_sale_1 = require("../sales/internal/prepare_random_sale");
const generate_random_cart_commodity_1 = require("./internal/generate_random_cart_commodity");
const test_api_shopping_cart_commodity_create_snapshot = async (pool) => {
    await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    await index_1.default.functional.shoppings.sellers.sales.update(pool.seller, sale.id, await (0, prepare_random_sale_1.prepare_random_sale)(pool));
    await e2e_1.TestValidator.httpError("snapshot", 422, () => (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale));
};
exports.test_api_shopping_cart_commodity_create_snapshot = test_api_shopping_cart_commodity_create_snapshot;
//# sourceMappingURL=test_api_shopping_cart_commodity_create_snapshot.js.map