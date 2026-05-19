"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_question_create = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_sale_question_1 = require("./internal/generate_random_sale_question");
const test_api_shopping_sale_question_create = async (pool) => {
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const question = await (0, generate_random_sale_question_1.generate_random_sale_question)(pool, sale);
    const read = await index_1.default.functional.shoppings.customers.sales.questions.at(pool.customer, sale.id, question.id);
    e2e_1.TestValidator.equals("read", question, read);
    const page = await index_1.default.functional.shoppings.customers.sales.questions.index(pool.customer, sale.id, {
        limit: 1,
    });
    e2e_1.TestValidator.equals("page", question.id, page.data[0].id);
};
exports.test_api_shopping_sale_question_create = test_api_shopping_sale_question_create;
//# sourceMappingURL=test_api_shopping_sale_question_create.js.map