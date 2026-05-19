"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_question_index_sort = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_sale_question_1 = require("./internal/generate_random_sale_question");
const test_api_shopping_sale_question_index_sort = async (pool) => {
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const total = await e2e_1.ArrayUtil.asyncRepeat(10, () => (0, generate_random_sale_question_1.generate_random_sale_question)(pool, sale));
    const validator = e2e_1.TestValidator.sort("sort questions", async (input) => {
        const page = await index_1.default.functional.shoppings.customers.sales.questions.index(pool.customer, sale.id, {
            sort: input,
            limit: total.length,
        });
        return page.data;
    });
    const components = [
        validator("created_at")(e2e_1.GaffComparator.dates((x) => x.created_at)),
        validator("updated_at")(e2e_1.GaffComparator.dates((x) => x.updated_at)),
        validator("title")(e2e_1.GaffComparator.strings((x) => x.title)),
    ];
    for (const comp of components) {
        await comp("+");
        await comp("-");
    }
};
exports.test_api_shopping_sale_question_index_sort = test_api_shopping_sale_question_index_sort;
//# sourceMappingURL=test_api_shopping_sale_question_index_sort.js.map