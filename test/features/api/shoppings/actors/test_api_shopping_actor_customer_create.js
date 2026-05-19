"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_actor_customer_create = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const TestGlobal_1 = require("../../../../TestGlobal");
const test_api_shopping_actor_customer_create = async (pool, connection) => {
    connection ??= pool.customer;
    const customer = await index_1.default.functional.shoppings.customers.authenticate.create(connection, {
        href: TestGlobal_1.TestGlobal.HREF,
        referrer: TestGlobal_1.TestGlobal.REFERRER,
        channel_code: pool.channel,
        external_user: null,
    });
    e2e_1.TestValidator.equals("citizen", customer.citizen, null);
    e2e_1.TestValidator.equals("external_user", customer.external_user, null);
    e2e_1.TestValidator.equals("member", customer.member, null);
    return customer;
};
exports.test_api_shopping_actor_customer_create = test_api_shopping_actor_customer_create;
//# sourceMappingURL=test_api_shopping_actor_customer_create.js.map