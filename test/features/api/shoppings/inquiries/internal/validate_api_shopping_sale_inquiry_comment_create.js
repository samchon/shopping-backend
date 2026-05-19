"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_api_shopping_sale_inquiry_comment_create = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const generate_random_sale_inquiry_comment_1 = require("./generate_random_sale_inquiry_comment");
const validate_api_shopping_sale_inquiry_comment_create = async (pool, admin, customer, seller, sale, inquiry) => {
    const generator = (0, generate_random_sale_inquiry_comment_1.generate_random_sale_inquiry_comment)({
        pool,
        sale,
        inquiry,
    });
    const comments = [
        await generator(admin),
        await generator(customer),
        await generator(seller),
    ];
    e2e_1.TestValidator.equals("of_admin", comments[0].writer, admin);
    e2e_1.TestValidator.equals("of_customer", comments[1].writer, customer);
    e2e_1.TestValidator.equals("of_seller", comments[2].writer, seller);
    const page = await index_1.default.functional.shoppings.customers.sales[`${inquiry.type}s`].comments.index(pool.customer, sale.id, inquiry.id, {
        limit: 3,
        sort: ["+created_at"],
    });
    e2e_1.TestValidator.equals("page", page.data, comments);
};
exports.validate_api_shopping_sale_inquiry_comment_create = validate_api_shopping_sale_inquiry_comment_create;
//# sourceMappingURL=validate_api_shopping_sale_inquiry_comment_create.js.map