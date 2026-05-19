"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_mileage_outcome_by_order = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_mileage_donation_1 = require("./internal/generate_random_mileage_donation");
const test_api_shopping_mileage_outcome_by_order = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    const donation = await (0, generate_random_mileage_donation_1.generate_random_mileage_donation)(pool, customer.citizen, {
        value: 1_000,
    });
    await validateBalance(pool, donation.value);
    await index_1.default.functional.shoppings.customers.orders.discount(pool.customer, order.id, {
        mileage: donation.value,
        deposit: 0,
        coupon_ids: [],
    });
    await validateBalance(pool, 0);
};
exports.test_api_shopping_mileage_outcome_by_order = test_api_shopping_mileage_outcome_by_order;
const validateBalance = async (pool, value) => {
    const balance = await index_1.default.functional.shoppings.customers.mileages.histories.balance(pool.customer);
    e2e_1.TestValidator.equals("balance", balance, value);
};
//# sourceMappingURL=test_api_shopping_mileage_outcome_by_order.js.map