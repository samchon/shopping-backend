"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_discount_and_publish = void 0;
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const generate_random_order_publish_1 = require("./internal/generate_random_order_publish");
const validate_api_shopping_order_discountable_1 = require("./internal/validate_api_shopping_order_discountable");
exports.test_api_shopping_order_discount_and_publish = (0, validate_api_shopping_order_discountable_1.validate_api_shopping_order_discountable)(async (pool, props) => {
    const combination = props.discountable.combinations[0];
    await index_1.default.functional.shoppings.customers.orders.discount(pool.customer, props.order.id, {
        deposit: 0,
        mileage: 0,
        coupon_ids: combination.coupons.map((c) => c.id),
    });
    await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, props.customer, props.order, true);
});
//# sourceMappingURL=test_api_shopping_order_discount_and_publish.js.map