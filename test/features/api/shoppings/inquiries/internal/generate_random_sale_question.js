"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_sale_question = void 0;
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const prepare_random_bbs_article_1 = require("../../../common/internal/prepare_random_bbs_article");
const generate_random_sale_question = async (pool, sale, input) => {
    const question = await index_1.default.functional.shoppings.customers.sales.questions.create(pool.customer, sale.id, {
        ...(0, prepare_random_bbs_article_1.prepare_random_bbs_article)(input),
        secret: input?.secret ?? false,
    });
    return question;
};
exports.generate_random_sale_question = generate_random_sale_question;
//# sourceMappingURL=generate_random_sale_question.js.map