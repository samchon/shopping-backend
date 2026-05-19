"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_mileage_donation = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const generate_random_mileage_donation_1 = require("./internal/generate_random_mileage_donation");
const test_api_shopping_mileage_donation = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const donation = await (0, generate_random_mileage_donation_1.generate_random_mileage_donation)(pool, customer.citizen, {
        value: 10_000,
    });
    e2e_1.TestValidator.equals("value", donation.value, VALUE);
    const balance = await index_1.default.functional.shoppings.customers.mileages.histories.balance(pool.customer);
    e2e_1.TestValidator.equals("balance", balance, VALUE);
};
exports.test_api_shopping_mileage_donation = test_api_shopping_mileage_donation;
const VALUE = 10_000;
//# sourceMappingURL=test_api_shopping_mileage_denoation.js.map