"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_cart_discountable_pseudo = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const validate_api_shopping_cart_discountable_1 = require("./internal/validate_api_shopping_cart_discountable");
exports.test_api_shopping_cart_discountable_pseudo = (0, validate_api_shopping_cart_discountable_1.validate_api_shopping_cart_discountable)(async (pool, props) => {
    const pseudos = await e2e_1.ArrayUtil.asyncMap(props.commodities, (commodity) => index_1.default.functional.shoppings.customers.carts.commodities.replica(pool.customer, commodity.id));
    const discountable = await index_1.default.functional.shoppings.customers.carts.commodities.discountable(pool.customer, {
        commodity_ids: [],
        pseudos,
    });
    e2e_1.TestValidator.equals("combinations.length", discountable.combinations.length, 2);
    e2e_1.TestValidator.equals("combinations[].amount", discountable.combinations.map((comb) => comb.amount), [15_000, 5_000]);
    e2e_1.TestValidator.equals("combinations[].coupons.length", discountable.combinations.map((comb) => comb.coupons.length), [3, 1]);
});
//# sourceMappingURL=test_api_shopping_cart_discountable_pseudo.js.map