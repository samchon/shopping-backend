"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_deposit_charge_create = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const generate_random_deposit_charge_1 = require("./internal/generate_random_deposit_charge");
const generate_random_deposit_charge_publish_1 = require("./internal/generate_random_deposit_charge_publish");
const test_api_shopping_deposit_charge_create = async (pool) => {
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const value = 50_000;
    const charge = await (0, generate_random_deposit_charge_1.generate_random_deposit_charge)(pool, {
        value,
    });
    e2e_1.TestValidator.equals("value", charge.value, value);
    await validateBalance(pool, 0);
    charge.publish = await (0, generate_random_deposit_charge_publish_1.generate_random_deposit_charge_publish)(pool, charge, true);
    await validateBalance(pool, value);
};
exports.test_api_shopping_deposit_charge_create = test_api_shopping_deposit_charge_create;
const validateBalance = async (pool, value) => {
    const balance = await index_1.default.functional.shoppings.customers.deposits.histories.balance(pool.customer);
    e2e_1.TestValidator.equals("balance", balance, value);
};
//# sourceMappingURL=test_api_shopping_deposit_charge_publish.js.map