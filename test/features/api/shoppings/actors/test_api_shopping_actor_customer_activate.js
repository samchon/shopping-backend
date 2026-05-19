"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_actor_customer_activate = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_create_1 = require("./test_api_shopping_actor_customer_create");
const test_api_shopping_actor_customer_activate = async (pool) => {
    const issued = await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool);
    e2e_1.TestValidator.equals("issued.citizen", false, !!issued.citizen);
    const input = {
        name: e2e_1.RandomGenerator.name(8),
        mobile: e2e_1.RandomGenerator.mobile(),
    };
    const activated = await index_1.default.functional.shoppings.customers.authenticate.activate(pool.customer, input);
    e2e_1.TestValidator.equals("activate.citizen", input, activated.citizen);
    return activated;
};
exports.test_api_shopping_actor_customer_activate = test_api_shopping_actor_customer_activate;
//# sourceMappingURL=test_api_shopping_actor_customer_activate.js.map