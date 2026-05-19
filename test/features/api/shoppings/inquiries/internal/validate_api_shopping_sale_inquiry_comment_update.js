"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_api_shopping_sale_inquiry_comment_update = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const prepare_random_bbs_article_comment_1 = require("../../../common/internal/prepare_random_bbs_article_comment");
const generate_random_sale_inquiry_comment_1 = require("./generate_random_sale_inquiry_comment");
const validate_api_shopping_sale_inquiry_comment_update = async (pool, customer, sale, inquiry) => {
    const comment = await (0, generate_random_sale_inquiry_comment_1.generate_random_sale_inquiry_comment)({
        pool,
        sale,
        inquiry,
    })(customer);
    comment.snapshots.push(...(await e2e_1.ArrayUtil.asyncRepeat(4, async () => {
        const snapshot = await index_1.default.functional.shoppings.customers.sales[`${inquiry.type}s`].comments.update(pool.customer, sale.id, inquiry.id, comment.id, (0, prepare_random_bbs_article_comment_1.prepare_random_bbs_article_comment)());
        return snapshot;
    })));
    const read = await index_1.default.functional.shoppings.customers.sales[`${inquiry.type}s`].comments.at(pool.customer, sale.id, inquiry.id, comment.id);
    e2e_1.TestValidator.equals("read", read, comment);
};
exports.validate_api_shopping_sale_inquiry_comment_update = validate_api_shopping_sale_inquiry_comment_update;
//# sourceMappingURL=validate_api_shopping_sale_inquiry_comment_update.js.map