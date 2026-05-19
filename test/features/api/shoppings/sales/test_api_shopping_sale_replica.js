"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_replica = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const prepare_random_sale_1 = require("./internal/prepare_random_sale");
const test_api_shopping_sale_replica = async (pool) => {
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const input = await (0, prepare_random_sale_1.prepare_random_sale)(pool);
    const sale = await index_1.default.functional.shoppings.sellers.sales.create(pool.seller, input);
    const replica = await index_1.default.functional.shoppings.sellers.sales.replica(pool.seller, sale.id);
    e2e_1.TestValidator.equals("replica", input, replica);
};
exports.test_api_shopping_sale_replica = test_api_shopping_sale_replica;
//# sourceMappingURL=test_api_shopping_sale_replica.js.map