"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_discount_impossible = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const validate_api_shopping_order_discountable_1 = require("./internal/validate_api_shopping_order_discountable");
exports.test_api_shopping_order_discount_impossible = (0, validate_api_shopping_order_discountable_1.validate_api_shopping_order_discountable)(async (pool, props) => {
    const coupons = props.discountable.combinations.map((comb) => comb.coupons[0]);
    await e2e_1.TestValidator.httpError("impossible", 422, () => index_1.default.functional.shoppings.customers.orders.discount(pool.customer, props.order.id, {
        deposit: 0,
        mileage: 0,
        coupon_ids: coupons.map((coupon) => coupon.id),
    }));
});
//# sourceMappingURL=test_api_shopping_order_discount_impossible.js.map