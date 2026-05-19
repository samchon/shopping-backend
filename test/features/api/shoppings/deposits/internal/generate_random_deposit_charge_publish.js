"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_deposit_charge_publish = void 0;
const uuid_1 = require("uuid");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const generate_random_deposit_charge_publish = async (pool, charge, paid) => {
    const publish = await index_1.default.functional.shoppings.customers.deposits.charges.publish.create(pool.customer, charge.id, paid
        ? {
            vendor: "somewhere",
            uid: (0, uuid_1.v4)(),
        }
        : {
            vendor: "somewhere",
            uid: (0, uuid_1.v4)(),
        });
    return publish;
};
exports.generate_random_deposit_charge_publish = generate_random_deposit_charge_publish;
//# sourceMappingURL=generate_random_deposit_charge_publish.js.map