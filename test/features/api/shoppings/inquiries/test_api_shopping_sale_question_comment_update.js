"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_question_comment_update = void 0;
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_sale_question_1 = require("./internal/generate_random_sale_question");
const validate_api_shopping_sale_inquiry_comment_update_1 = require("./internal/validate_api_shopping_sale_inquiry_comment_update");
const test_api_shopping_sale_question_comment_update = async (pool) => {
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const question = await (0, generate_random_sale_question_1.generate_random_sale_question)(pool, sale);
    await (0, validate_api_shopping_sale_inquiry_comment_update_1.validate_api_shopping_sale_inquiry_comment_update)(pool, customer, sale, question);
};
exports.test_api_shopping_sale_question_comment_update = test_api_shopping_sale_question_comment_update;
//# sourceMappingURL=test_api_shopping_sale_question_comment_update.js.map