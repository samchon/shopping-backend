"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_sale_inquiry_answer = void 0;
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const prepare_random_bbs_article_1 = require("../../../common/internal/prepare_random_bbs_article");
const generate_random_sale_inquiry_answer = async (pool, sale, question, input) => {
    const answer = await index_1.default.functional.shoppings.sellers.sales.questions.answer.create(pool.seller, sale.id, question.id, (0, prepare_random_bbs_article_1.prepare_random_bbs_article)(input));
    return answer;
};
exports.generate_random_sale_inquiry_answer = generate_random_sale_inquiry_answer;
//# sourceMappingURL=generate_random_sale_inquiry_answer.js.map