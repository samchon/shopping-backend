"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_deposit_histories_index_search = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_deposit_histories_1 = require("./internal/generate_random_deposit_histories");
const test_api_shopping_deposit_histories_index_search = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    await e2e_1.ArrayUtil.asyncRepeat(10, () => (0, generate_random_deposit_histories_1.generate_random_deposit_histories)(pool, {
        charge: (0, tstl_1.randint)(1_000, 9_000),
        discount: (0, tstl_1.randint)(100, 999),
    }));
    const entire = await index_1.default.functional.shoppings.customers.deposits.histories.index(pool.customer, {
        limit: 100,
    });
    const validator = e2e_1.TestValidator.search("search", async (input) => {
        const page = await index_1.default.functional.shoppings.customers.deposits.histories.index(pool.customer, {
            limit: 100,
            search: input,
        });
        return page.data;
    }, entire.data, 5);
    await validator({
        fields: ["deposit.code"],
        values: (history) => [history.deposit.code],
        filter: (history, [code]) => history.deposit.code === code,
        request: ([code]) => ({ deposit: { code } }),
    });
    await validator({
        fields: ["deposit.direction"],
        values: (history) => [history.deposit.direction],
        filter: (history, [direction]) => history.deposit.direction === direction,
        request: ([direction]) => ({ deposit: { direction } }),
    });
    await validator({
        fields: ["from", "to"],
        values: (history) => [history.created_at, history.created_at],
        filter: (history, [from, to]) => history.created_at >= from && history.created_at <= to,
        request: ([from, to]) => ({ from, to }),
    });
};
exports.test_api_shopping_deposit_histories_index_search = test_api_shopping_deposit_histories_index_search;
//# sourceMappingURL=test_api_shopping_deposit_histories_index_search.js.map