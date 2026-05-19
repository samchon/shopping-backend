"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_deposit_histories_index_sort = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_deposit_histories_1 = require("./internal/generate_random_deposit_histories");
const test_api_shopping_deposit_histories_index_sort = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    await e2e_1.ArrayUtil.asyncRepeat(10, () => (0, generate_random_deposit_histories_1.generate_random_deposit_histories)(pool, {
        charge: (0, tstl_1.randint)(1_000, 9_000),
        discount: (0, tstl_1.randint)(100, 999),
    }));
    const validator = e2e_1.TestValidator.sort("sort", async (input) => {
        const page = await index_1.default.functional.shoppings.customers.deposits.histories.index(pool.customer, {
            limit: 100,
            sort: input,
        });
        return page.data;
    });
    const components = [
        validator("deposit.code")(e2e_1.GaffComparator.strings((x) => x.deposit.code)),
        validator("history.value")(e2e_1.GaffComparator.numbers((x) => x.value)),
        validator("history.created_at")(e2e_1.GaffComparator.dates((x) => x.created_at)),
    ];
    for (const comp of components) {
        await comp("+");
        await comp("-");
    }
};
exports.test_api_shopping_deposit_histories_index_sort = test_api_shopping_deposit_histories_index_sort;
//# sourceMappingURL=test_api_shopping_deposit_histories_index_sort.js.map