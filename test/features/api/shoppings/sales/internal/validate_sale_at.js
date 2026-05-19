"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_sale_at = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const validate_sale_at = async (props) => {
    await validate((id) => index_1.default.functional.shoppings.sellers.sales.at(props.pool.seller, id), props.sale);
    await validate((id) => index_1.default.functional.shoppings.admins.sales.at(props.pool.admin, id), props.sale);
    if (props.visibleToCustomer)
        await validate((id) => index_1.default.functional.shoppings.customers.sales.at(props.pool.admin, id), props.sale);
    else
        await e2e_1.TestValidator.httpError("customer cannot see the sale", [404, 410, 422], () => validate((id) => index_1.default.functional.shoppings.customers.sales.at(props.pool.admin, id), props.sale));
};
exports.validate_sale_at = validate_sale_at;
const validate = async (fetcher, sale) => {
    const read = await fetcher(sale.id);
    e2e_1.TestValidator.equals("read", sale, read);
};
//# sourceMappingURL=validate_sale_at.js.map