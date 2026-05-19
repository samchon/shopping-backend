"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_discount_by_ticket = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const validate_api_shopping_order_discountable_1 = require("./internal/validate_api_shopping_order_discountable");
exports.test_api_shopping_order_discount_by_ticket = (0, validate_api_shopping_order_discountable_1.validate_api_shopping_order_discountable)(async (pool, props) => {
    const combination = props.discountable.combinations[0];
    const tickets = await e2e_1.ArrayUtil.asyncMap(combination.coupons, (coupon) => index_1.default.functional.shoppings.customers.coupons.tickets.create(pool.customer, {
        coupon_id: coupon.id,
    }));
    const price = await index_1.default.functional.shoppings.customers.orders.discount(pool.customer, props.order.id, {
        deposit: 0,
        mileage: 0,
        coupon_ids: tickets.map((ticket) => ticket.coupon.id),
    });
    e2e_1.TestValidator.equals("amount", price.ticket, combination.amount);
    e2e_1.TestValidator.equals("coupons", price.ticket_payments
        .map((tp) => tp.ticket.coupon)
        .sort((x, y) => x.id.localeCompare(y.id)), combination.coupons.sort((x, y) => x.id.localeCompare(y.id)));
});
//# sourceMappingURL=test_api_shopping_order_discount_by_ticket.js.map