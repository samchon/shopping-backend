"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_sale_review = void 0;
const tstl_1 = require("tstl");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const prepare_random_bbs_article_1 = require("../../../common/internal/prepare_random_bbs_article");
const generate_random_sale_review = async (pool, sale, good, input) => {
    const review = await index_1.default.functional.shoppings.customers.sales.reviews.create(pool.customer, sale.id, {
        ...(0, prepare_random_bbs_article_1.prepare_random_bbs_article)(),
        score: (0, tstl_1.randint)(0, 10) * 10,
        good_id: good.id,
        ...input,
    });
    return review;
};
exports.generate_random_sale_review = generate_random_sale_review;
//# sourceMappingURL=generate_random_sale_review.js.map