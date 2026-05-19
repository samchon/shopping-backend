"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_api_shopping_sale_inquiry_answer_create = void 0;
const e2e_1 = require("@nestia/e2e");
const prepare_random_bbs_article_1 = require("../../../common/internal/prepare_random_bbs_article");
const validate_api_shopping_sale_inquiry_answer_create = (accessor) => async (pool, sale, inquiry) => {
    e2e_1.TestValidator.equals("not answered yet", inquiry.answer, null);
    const answer = await accessor.create(pool.seller, sale.id, inquiry.id, (0, prepare_random_bbs_article_1.prepare_random_bbs_article)());
    inquiry.answer = answer;
    const read = await accessor.read(pool.customer, sale.id, inquiry.id);
    e2e_1.TestValidator.equals("read", inquiry, read);
};
exports.validate_api_shopping_sale_inquiry_answer_create = validate_api_shopping_sale_inquiry_answer_create;
//# sourceMappingURL=validate_api_shopping_sale_inquiry_answer_create.js.map