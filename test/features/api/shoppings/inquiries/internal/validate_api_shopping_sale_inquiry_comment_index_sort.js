"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_api_shopping_sale_inquiry_comment_index_sort = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const generate_random_sale_inquiry_comment_1 = require("./generate_random_sale_inquiry_comment");
const validate_api_shopping_sale_inquiry_comment_index_sort = async (pool, admin, customer, seller, sale, inquiry) => {
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
    const validator = e2e_1.TestValidator.sort("sort comments", async (input) => {
        const page = await index_1.default.functional.shoppings.customers.sales[`${inquiry.type}s`].comments.index(pool.customer, sale.id, inquiry.id, {
            sort: input,
            limit: total.length,
        });
        return page.data;
    });
    const components = [
        validator("created_at")(e2e_1.GaffComparator.dates((x) => x.created_at)),
    ];
    for (const comp of components) {
        await comp("+");
        await comp("-");
    }
};
exports.validate_api_shopping_sale_inquiry_comment_index_sort = validate_api_shopping_sale_inquiry_comment_index_sort;
//# sourceMappingURL=validate_api_shopping_sale_inquiry_comment_index_sort.js.map