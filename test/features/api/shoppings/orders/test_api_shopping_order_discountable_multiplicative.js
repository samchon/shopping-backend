"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_discountable_multiplicative = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_create_1 = require("../actors/test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_coupon_1 = require("../coupons/internal/generate_random_coupon");
const prepare_random_coupon_1 = require("../coupons/internal/prepare_random_coupon");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_order_1 = require("./internal/generate_random_order");
const test_api_shopping_order_discountable_multiplicative = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity], () => 10);
    await (0, generate_random_coupon_1.generate_random_coupon)({
        types: [],
        direction: "include",
        customer: null,
        sale,
        prepare: (criterias) => (0, prepare_random_coupon_1.prepare_random_coupon)({
            criterias,
            restriction: {
                access: "public",
                volume: null,
                volume_per_citizen: null,
            },
            discount: {
                unit: "amount",
                value: 1234,
                threshold: null,
                multiplicative: true,
            },
        }),
        create: (input) => index_1.default.functional.shoppings.admins.coupons.create(pool.admin, input),
    });
    const discountable = await index_1.default.functional.shoppings.customers.orders.discountable(pool.customer, order.id, {
        good_ids: [order.goods[0].id],
    });
    e2e_1.TestValidator.equals("discountable.combinations[].amount", discountable.combinations.map((comb) => comb.amount), [12340]);
};
exports.test_api_shopping_order_discountable_multiplicative = test_api_shopping_order_discountable_multiplicative;
//# sourceMappingURL=test_api_shopping_order_discountable_multiplicative.js.map