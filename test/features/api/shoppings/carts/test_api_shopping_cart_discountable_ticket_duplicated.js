"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_cart_discountable_ticket_duplicated = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const validate_api_shopping_cart_discountable_1 = require("./internal/validate_api_shopping_cart_discountable");
exports.test_api_shopping_cart_discountable_ticket_duplicated = (0, validate_api_shopping_cart_discountable_1.validate_api_shopping_cart_discountable)(async (pool, props) => {
    await e2e_1.ArrayUtil.asyncMap(props.coupons, (coupon) => e2e_1.ArrayUtil.asyncRepeat(3, () => index_1.default.functional.shoppings.customers.coupons.tickets.create(pool.customer, {
        coupon_id: coupon.id,
    })));
    const discountable = await index_1.default.functional.shoppings.customers.carts.commodities.discountable(pool.customer, {
        commodity_ids: props.commodities.map((commodity) => commodity.id),
        pseudos: [],
    });
    e2e_1.TestValidator.equals("combinations[].amount", discountable.combinations.map((c) => c.amount), props.discountable.combinations.map((c) => c.amount));
    e2e_1.TestValidator.equals("combinations[].coupons.length", discountable.combinations.map((comb) => comb.coupons.length), [0, 0]);
    e2e_1.TestValidator.equals("combinations[].tickets.length", discountable.combinations.map((comb) => comb.tickets.length), [3, 1]);
});
//# sourceMappingURL=test_api_shopping_cart_discountable_ticket_duplicated.js.map