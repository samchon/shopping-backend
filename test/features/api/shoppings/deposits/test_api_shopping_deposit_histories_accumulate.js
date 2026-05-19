"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_deposit_histories_accumulate = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_deposit_histories_1 = require("./internal/generate_random_deposit_histories");
const test_api_shopping_deposit_histories_accumulate = async (pool) => {
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    await e2e_1.ArrayUtil.asyncRepeat(3, () => (0, generate_random_deposit_histories_1.generate_random_deposit_histories)(pool, {
        charge: 1_000,
        discount: 300,
    }));
    const histories = await index_1.default.functional.shoppings.customers.deposits.histories.index(pool.customer, {
        limit: 100,
        sort: ["+history.created_at"],
    });
    e2e_1.TestValidator.equals("histories[].value", histories.data.map((history) => history.value * history.deposit.direction), e2e_1.ArrayUtil.repeat(3, () => [1_000, -300]).flat());
    e2e_1.TestValidator.equals("histories[].balance", histories.data.map((history) => history.balance), histories.data.map((history, i) => history.value * history.deposit.direction +
        histories.data
            .slice(0, i)
            .map((history) => history.value * history.deposit.direction)
            .reduce((a, b) => a + b, 0)));
};
exports.test_api_shopping_deposit_histories_accumulate = test_api_shopping_deposit_histories_accumulate;
//# sourceMappingURL=test_api_shopping_deposit_histories_accumulate.js.map