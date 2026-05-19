"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_order_publish = void 0;
const e2e_1 = require("@nestia/e2e");
const uuid_1 = require("uuid");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const prepare_random_address_1 = require("./prepare_random_address");
const generate_random_order_publish = async (pool, customer, order, paid, address) => {
    const price = await index_1.default.functional.shoppings.customers.orders.price(pool.customer, order.id);
    address ??= (0, prepare_random_address_1.prepare_random_address)(customer.citizen, address);
    const input = price.cash === 0
        ? {
            vendor: null,
            address,
        }
        : paid
            ? {
                vendor: {
                    code: "somewhere",
                    uid: (0, uuid_1.v4)(),
                },
                address,
            }
            : {
                vendor: {
                    code: "somewhere",
                    uid: `vbank::${(0, uuid_1.v4)()}`,
                },
                address,
            };
    const publish = await index_1.default.functional.shoppings.customers.orders.publish.create(pool.customer, order.id, input);
    e2e_1.TestValidator.equals("paid_at", !!publish.paid_at, paid);
    return publish;
};
exports.generate_random_order_publish = generate_random_order_publish;
//# sourceMappingURL=generate_random_order_publish.js.map