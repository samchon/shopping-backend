"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_actor_customer_ip = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const TestGlobal_1 = require("../../../../TestGlobal");
const test_api_shopping_actor_customer_ip = async (pool) => {
    const automatic = await create(pool, undefined);
    const manual = await create(pool, PSEUDO);
    e2e_1.TestValidator.predicate("automatic", () => automatic.ip !== PSEUDO);
    e2e_1.TestValidator.equals("manual", manual.ip, PSEUDO);
};
exports.test_api_shopping_actor_customer_ip = test_api_shopping_actor_customer_ip;
const create = async (pool, ip) => {
    const customer = await index_1.default.functional.shoppings.customers.authenticate.create(pool.customer, {
        href: TestGlobal_1.TestGlobal.HREF,
        referrer: TestGlobal_1.TestGlobal.REFERRER,
        channel_code: pool.channel,
        external_user: null,
        ip,
    });
    return customer;
};
const PSEUDO = "192.168.0.100";
//# sourceMappingURL=test_api_shopping_actor_customer_ip.js.map