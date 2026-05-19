"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_deposit_outcome_by_order = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_sole_sale_1 = require("../sales/internal/generate_random_sole_sale");
const generate_random_deposit_charge_1 = require("./internal/generate_random_deposit_charge");
const generate_random_deposit_charge_publish_1 = require("./internal/generate_random_deposit_charge_publish");
const test_api_shopping_deposit_outcome_by_order = async (pool) => {
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const charge = await (0, generate_random_deposit_charge_1.generate_random_deposit_charge)(pool, {
        value: 1_000,
    });
    charge.publish = await (0, generate_random_deposit_charge_publish_1.generate_random_deposit_charge_publish)(pool, charge, true);
    const sale = await (0, generate_random_sole_sale_1.generate_random_sole_sale)(pool, {
        nominal: 10_000,
        real: 10_000,
    });
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    order.price =
        await index_1.default.functional.shoppings.customers.orders.discount(pool.customer, order.id, {
            deposit: charge.value,
            mileage: 0,
            coupon_ids: [],
        });
    const balance = await index_1.default.functional.shoppings.customers.deposits.histories.balance(pool.customer);
    e2e_1.TestValidator.equals("balance", balance, 0);
};
exports.test_api_shopping_deposit_outcome_by_order = test_api_shopping_deposit_outcome_by_order;
//# sourceMappingURL=test_api_shopping_deposit_outcome_by_order.js.map