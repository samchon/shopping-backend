"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_discount_after_discount = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const validate_api_shopping_order_discountable_1 = require("./internal/validate_api_shopping_order_discountable");
exports.test_api_shopping_order_discount_after_discount = (0, validate_api_shopping_order_discountable_1.validate_api_shopping_order_discountable)(async (pool, props) => {
    const combination = props.discountable.combinations[0];
    const discount = async () => {
        const price = await index_1.default.functional.shoppings.customers.orders.discount(pool.customer, props.order.id, {
            deposit: 0,
            mileage: 0,
            coupon_ids: combination.coupons.map((coupon) => coupon.id),
        });
        return price;
    };
    const first = await discount();
    const second = await discount();
    e2e_1.TestValidator.equals("coupons", first.ticket_payments
        .map((tp) => tp.ticket.coupon)
        .sort((x, y) => x.id.localeCompare(y.id)), second.ticket_payments
        .map((tp) => tp.ticket.coupon)
        .sort((x, y) => x.id.localeCompare(y.id)));
});
//# sourceMappingURL=test_api_shopping_order_discount_after_discount.js.map