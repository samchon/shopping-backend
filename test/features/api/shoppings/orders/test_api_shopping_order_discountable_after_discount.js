"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_discountable_after_discount = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const validate_api_shopping_order_discountable_1 = require("./internal/validate_api_shopping_order_discountable");
exports.test_api_shopping_order_discountable_after_discount = (0, validate_api_shopping_order_discountable_1.validate_api_shopping_order_discountable)(async (pool, props) => {
    await index_1.default.functional.shoppings.customers.orders.discount(pool.customer, props.order.id, {
        deposit: 0,
        mileage: 0,
        coupon_ids: props.discountable.combinations[0].coupons.map((coupon) => coupon.id),
    });
    const discountable = await index_1.default.functional.shoppings.customers.orders.discountable(pool.customer, props.order.id, {
        good_ids: props.order.goods.map((good) => good.id),
    });
    e2e_1.TestValidator.equals("discountable.combinations[].amount", props.discountable.combinations[0].amount, discountable.combinations[0].amount);
    e2e_1.TestValidator.equals("discountable.combinations[0].coupons", props.discountable.combinations[0].tickets
        .map((t) => t.coupon)
        .sort((a, b) => a.id.localeCompare(b.id)), discountable.combinations[0].coupons.sort((a, b) => a.id.localeCompare(b.id)));
});
//# sourceMappingURL=test_api_shopping_order_discountable_after_discount.js.map