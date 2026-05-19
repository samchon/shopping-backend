"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_discount_after_erase = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const generate_random_order_1 = require("./internal/generate_random_order");
const validate_api_shopping_order_discountable_1 = require("./internal/validate_api_shopping_order_discountable");
exports.test_api_shopping_order_discount_after_erase = (0, validate_api_shopping_order_discountable_1.validate_api_shopping_order_discountable)(async (pool, props) => {
    const combination = props.discountable.combinations[0];
    const commodities = await e2e_1.ArrayUtil.asyncMap(await e2e_1.ArrayUtil.asyncMap(props.order.goods.map((good) => good.commodity), (commodity) => index_1.default.functional.shoppings.customers.carts.commodities.replica(pool.customer, commodity.id)), (input) => index_1.default.functional.shoppings.customers.carts.commodities.create(pool.customer, input));
    const order = await (0, generate_random_order_1.generate_random_order)(pool, commodities);
    const discount = async (order) => {
        const price = await index_1.default.functional.shoppings.customers.orders.discount(pool.customer, order.id, {
            deposit: 0,
            mileage: 0,
            coupon_ids: combination.coupons.map((coupon) => coupon.id),
        });
        return price;
    };
    const price = await discount(props.order);
    await index_1.default.functional.shoppings.customers.orders.erase(pool.customer, props.order.id);
    const retry = await discount(order);
    e2e_1.TestValidator.equals("coupons", price.ticket_payments
        .map((tp) => tp.ticket.coupon)
        .sort((x, y) => x.id.localeCompare(y.id)), retry.ticket_payments
        .map((tp) => tp.ticket.coupon)
        .sort((x, y) => x.id.localeCompare(y.id)));
});
//# sourceMappingURL=test_api_shopping_order_discount_after_erase.js.map