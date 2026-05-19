"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_api_shopping_sale_inquiry_comment_index_search = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const generate_random_sale_inquiry_comment_1 = require("./generate_random_sale_inquiry_comment");
const validate_api_shopping_sale_inquiry_comment_index_search = async (pool, admin, customer, seller, sale, inquiry) => {
    const generator = (0, generate_random_sale_inquiry_comment_1.generate_random_sale_inquiry_comment)({
        pool,
        sale,
        inquiry,
    });
    const total = [
        await generator(admin),
        await generator(customer),
        await generator(seller),
        await generator(admin),
        await generator(customer),
        await generator(seller),
        await generator(admin),
        await generator(customer),
        await generator(seller),
    ];
    const search = e2e_1.TestValidator.search("search comments", async (search) => {
        const page = await index_1.default.functional.shoppings.customers.sales[`${inquiry.type}s`].comments.index(pool.customer, sale.id, inquiry.id, {
            search,
            limit: total.length,
        });
        return page.data;
    }, total);
    await search({
        fields: ["name"],
        values: (c) => [c.writer.citizen.name],
        request: ([name]) => ({ name }),
        filter: (c, [name]) => c.writer.citizen.name === name,
    });
    await search({
        fields: ["nickname"],
        values: (c) => [c.writer.member.nickname],
        request: ([nickname]) => ({ nickname }),
        filter: (c, [nickname]) => c.writer.member.nickname.includes(nickname) ?? false,
    });
    await search({
        fields: ["body"],
        values: (c) => [c.snapshots.at(-1).body.substring(0, 10)],
        request: ([body]) => ({ body }),
        filter: (c, [body]) => c.snapshots.at(-1).body.includes(body),
    });
};
exports.validate_api_shopping_sale_inquiry_comment_index_search = validate_api_shopping_sale_inquiry_comment_index_search;
//# sourceMappingURL=validate_api_shopping_sale_inquiry_comment_index_search.js.map