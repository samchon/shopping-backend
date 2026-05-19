"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_discountable_after_erase = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const generate_random_order_1 = require("./internal/generate_random_order");
const validate_api_shopping_order_discountable_1 = require("./internal/validate_api_shopping_order_discountable");
exports.test_api_shopping_order_discountable_after_erase = (0, validate_api_shopping_order_discountable_1.validate_api_shopping_order_discountable)(async (pool, props) => {
    const commodities = await e2e_1.ArrayUtil.asyncMap(await e2e_1.ArrayUtil.asyncMap(props.order.goods.map((good) => good.commodity), (commodity) => index_1.default.functional.shoppings.customers.carts.commodities.replica(pool.customer, commodity.id)), (input) => index_1.default.functional.shoppings.customers.carts.commodities.create(pool.customer, input));
    const order = await (0, generate_random_order_1.generate_random_order)(pool, commodities);
    await index_1.default.functional.shoppings.customers.orders.erase(pool.customer, props.order.id);
    const discountable = await index_1.default.functional.shoppings.customers.orders.discountable(pool.customer, order.id, {
        good_ids: order.goods.map((good) => good.id),
    });
    e2e_1.TestValidator.equals("discountable.combinations[].amount", props.discountable.combinations[0].amount, discountable.combinations[0].amount);
    e2e_1.TestValidator.equals("discountable.combinations[].coupons[]", props.discountable.combinations.map((comb) => comb.coupons.sort((a, b) => a.id.localeCompare(b.id))), discountable.combinations.map((comb) => comb.coupons.sort((a, b) => a.id.localeCompare(b.id))));
});
//# sourceMappingURL=test_api_shopping_order_discountable_after_erase.js.map