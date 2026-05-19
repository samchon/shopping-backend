"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_sale_inquiry_comment = void 0;
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const prepare_random_bbs_article_comment_1 = require("../../../common/internal/prepare_random_bbs_article_comment");
const generate_random_sale_inquiry_comment = (asset) => async (actor, input) => {
    const actorType = actor.type === "customer"
        ? "customer"
        : actor.type === "seller"
            ? "seller"
            : "admin";
    const comment = await index_1.default.functional.shoppings[`${actorType}s`].sales[`${asset.inquiry.type}s`].comments.create(asset.pool[actorType], asset.sale.id, asset.inquiry.id, (0, prepare_random_bbs_article_comment_1.prepare_random_bbs_article_comment)(input));
    return comment;
};
exports.generate_random_sale_inquiry_comment = generate_random_sale_inquiry_comment;
//# sourceMappingURL=generate_random_sale_inquiry_comment.js.map