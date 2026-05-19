"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_api_shopping_sale_inquiry_answer_update = void 0;
const e2e_1 = require("@nestia/e2e");
const prepare_random_bbs_article_1 = require("../../../common/internal/prepare_random_bbs_article");
const validate_api_shopping_sale_inquiry_answer_update = (accessor) => async (pool, sale, inquiry) => {
    const answer = await accessor.create(pool.seller, sale.id, inquiry.id, (0, prepare_random_bbs_article_1.prepare_random_bbs_article)());
    inquiry.answer = answer;
    answer.snapshots.push(...(await e2e_1.ArrayUtil.asyncRepeat(4, () => accessor.update(pool.seller, sale.id, inquiry.id, (0, prepare_random_bbs_article_1.prepare_random_bbs_article)()))));
    const read = await accessor.read(pool.customer, sale.id, inquiry.id);
    e2e_1.TestValidator.equals("read", inquiry, read);
};
exports.validate_api_shopping_sale_inquiry_answer_update = validate_api_shopping_sale_inquiry_answer_update;
//# sourceMappingURL=validate_api_shopping_sale_inquiry_answer_update.js.map