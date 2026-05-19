"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_order_publish_of_zero = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const prepare_random_cart_commodity_stock_1 = require("../carts/internal/prepare_random_cart_commodity_stock");
const generate_random_coupon_1 = require("../coupons/internal/generate_random_coupon");
const prepare_random_coupon_1 = require("../coupons/internal/prepare_random_coupon");
const generate_random_deposit_charge_1 = require("../deposits/internal/generate_random_deposit_charge");
const generate_random_deposit_charge_publish_1 = require("../deposits/internal/generate_random_deposit_charge_publish");
const generate_random_mileage_donation_1 = require("../mileages/internal/generate_random_mileage_donation");
const generate_random_sole_sale_1 = require("../sales/internal/generate_random_sole_sale");
const generate_random_order_1 = require("./internal/generate_random_order");
const prepare_random_address_1 = require("./internal/prepare_random_address");
const test_api_shopping_order_publish_of_zero = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const sale = await (0, generate_random_sole_sale_1.generate_random_sole_sale)(pool, {
        nominal: 50_000,
        real: 40_000,
    });
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale, {
        volume: 1,
        stocks: [
            (0, prepare_random_cart_commodity_stock_1.prepare_random_cart_commodity_stock)(sale.units[0], {
                quantity: 1,
            }),
        ],
    });
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity], () => 1);
    const coupon = await (0, generate_random_coupon_1.generate_random_coupon)({
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
                unit: "percent",
                value: 50,
                threshold: null,
            },
        }),
        create: (input) => index_1.default.functional.shoppings.admins.coupons.create(pool.admin, input),
    });
    const donation = await (0, generate_random_mileage_donation_1.generate_random_mileage_donation)(pool, customer.citizen, {
        value: 10_000,
    });
    const charge = await (0, generate_random_deposit_charge_1.generate_random_deposit_charge)(pool, {
        value: 10_000,
    });
    charge.publish = await (0, generate_random_deposit_charge_publish_1.generate_random_deposit_charge_publish)(pool, charge, true);
    const price = await index_1.default.functional.shoppings.customers.orders.discount(pool.customer, order.id, {
        coupon_ids: [coupon.id],
        deposit: charge.value,
        mileage: donation.value,
    });
    e2e_1.TestValidator.equals("ticket", price.ticket, 20_000);
    e2e_1.TestValidator.equals("deposit", price.deposit, 10_000);
    e2e_1.TestValidator.equals("mileage", price.mileage, 10_000);
    e2e_1.TestValidator.equals("cash", price.cash, 0);
    const publish = await index_1.default.functional.shoppings.customers.orders.publish.create(pool.customer, order.id, {
        address: (0, prepare_random_address_1.prepare_random_address)(customer.citizen),
        vendor: null,
    });
    e2e_1.TestValidator.equals("paid", !!publish.paid_at, true);
};
exports.test_api_shopping_order_publish_of_zero = test_api_shopping_order_publish_of_zero;
//# sourceMappingURL=test_api_shopping_order_publish_of_zero.js.map