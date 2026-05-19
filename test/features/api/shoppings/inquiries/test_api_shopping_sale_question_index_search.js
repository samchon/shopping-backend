"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_question_index_search = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_sale_question_1 = require("./internal/generate_random_sale_question");
const test_api_shopping_sale_question_index_search = async (pool) => {
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const total = await e2e_1.ArrayUtil.asyncRepeat(10, async () => {
        await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
        return (0, generate_random_sale_question_1.generate_random_sale_question)(pool, sale);
    });
    const expected = await index_1.default.functional.shoppings.customers.sales.questions.index(pool.customer, sale.id, {
        limit: total.length,
    });
    const search = e2e_1.TestValidator.search("search", async (search) => {
        const page = await index_1.default.functional.shoppings.customers.sales.questions.index(pool.customer, sale.id, {
            search,
            limit: total.length,
        });
        return page.data;
    }, expected.data, 2);
    await search({
        fields: ["name"],
        values: (arc) => [arc.customer.citizen.name],
        request: ([name]) => ({ name }),
        filter: (arc, [name]) => arc.customer.citizen.name === name,
    });
    await search({
        fields: ["nickname"],
        values: (arc) => [
            arc.customer.member?.nickname ??
                arc.customer.external_user?.nickname ??
                "",
        ],
        request: ([nickname]) => ({ nickname }),
        filter: (arc, [nickname]) => (arc.customer.member?.nickname ?? arc.customer.external_user?.nickname)?.includes(nickname) ?? false,
    });
    await search({
        fields: ["title"],
        values: (arc) => [arc.title],
        request: ([title]) => ({ title }),
        filter: (arc, [title]) => arc.title.includes(title),
    });
    for (const flag of [true, false])
        await search({
            fields: ["answered"],
            values: () => [flag],
            request: ([answered]) => ({ answered }),
            filter: (arc, [answered]) => !!arc.answer === answered,
        });
    await search({
        fields: ["answered"],
        values: () => [null],
        request: ([answered]) => ({ answered }),
        filter: () => true,
    });
};
exports.test_api_shopping_sale_question_index_search = test_api_shopping_sale_question_index_search;
//# sourceMappingURL=test_api_shopping_sale_question_index_search.js.map