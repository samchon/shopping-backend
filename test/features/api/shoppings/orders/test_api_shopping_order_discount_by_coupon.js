"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_discount_by_coupon = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_coupon_1 = require("../coupons/internal/generate_random_coupon");
const prepare_random_coupon_1 = require("../coupons/internal/prepare_random_coupon");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_order_1 = require("./internal/generate_random_order");
const test_api_shopping_order_discount_by_coupon = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    const coupon = await (0, generate_random_coupon_1.generate_random_coupon)({
        types: [],
        direction: "include",
        customer: null,
        sale,
        prepare: (criterias) => (0, prepare_random_coupon_1.prepare_random_coupon)({
            criterias,
            discount: {
                unit: "percent",
                value: 50,
                limit: null,
                threshold: null,
            },
        }),
        create: (input) => index_1.default.functional.shoppings.admins.coupons.create(pool.admin, input),
    });
    const price = await index_1.default.functional.shoppings.customers.orders.discount(pool.customer, order.id, {
        deposit: 0,
        mileage: 0,
        coupon_ids: [coupon.id],
    });
    e2e_1.TestValidator.equals("order.price.cash", price.real, price.cash * 2);
    e2e_1.TestValidator.equals("order.price.ticket", price.real, price.ticket * 2);
    const reloaded = await index_1.default.functional.shoppings.customers.orders.at(pool.customer, order.id);
    for (const good of reloaded.goods) {
        e2e_1.TestValidator.equals("good.price.cash", good.price.real, good.price.cash * 2);
        e2e_1.TestValidator.equals("good.price.ticket", good.price.real, good.price.ticket * 2);
    }
};
exports.test_api_shopping_order_discount_by_coupon = test_api_shopping_order_discount_by_coupon;
//# sourceMappingURL=test_api_shopping_order_discount_by_coupon.js.map