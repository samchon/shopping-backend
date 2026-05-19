"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_question_answer_create = void 0;
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_sale_question_1 = require("./internal/generate_random_sale_question");
const validate_api_shopping_sale_inquiry_answer_create_1 = require("./internal/validate_api_shopping_sale_inquiry_answer_create");
const test_api_shopping_sale_question_answer_create = async (pool) => {
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const question = await (0, generate_random_sale_question_1.generate_random_sale_question)(pool, sale);
    await (0, validate_api_shopping_sale_inquiry_answer_create_1.validate_api_shopping_sale_inquiry_answer_create)({
        read: index_1.default.functional.shoppings.customers.sales.questions.at,
        create: index_1.default.functional.shoppings.sellers.sales.questions.answer.create,
    })(pool, sale, question);
};
exports.test_api_shopping_sale_question_answer_create = test_api_shopping_sale_question_answer_create;
//# sourceMappingURL=test_api_shopping_sale_question_answer_create.js.map