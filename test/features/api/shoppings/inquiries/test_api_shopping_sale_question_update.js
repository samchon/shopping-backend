"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_question_update = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const prepare_random_bbs_article_1 = require("../../common/internal/prepare_random_bbs_article");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_sale_question_1 = require("./internal/generate_random_sale_question");
const test_api_shopping_sale_question_update = async (pool) => {
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const question = await (0, generate_random_sale_question_1.generate_random_sale_question)(pool, sale);
    question.snapshots.push(...(await e2e_1.ArrayUtil.asyncRepeat(4, async () => {
        const snapshot = await index_1.default.functional.shoppings.customers.sales.questions.update(pool.customer, sale.id, question.id, (0, prepare_random_bbs_article_1.prepare_random_bbs_article)());
        return snapshot;
    })));
    const read = await index_1.default.functional.shoppings.customers.sales.questions.at(pool.customer, sale.id, question.id);
    e2e_1.TestValidator.equals("read", question, read);
};
exports.test_api_shopping_sale_question_update = test_api_shopping_sale_question_update;
//# sourceMappingURL=test_api_shopping_sale_question_update.js.map