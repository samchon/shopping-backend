"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_deposit_charge = void 0;
const tstl_1 = require("tstl");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const generate_random_deposit_charge = async (pool, input) => {
    const charge = await index_1.default.functional.shoppings.customers.deposits.charges.create(pool.customer, {
        value: (0, tstl_1.randint)(10, 100) * 10_000,
        ...input,
    });
    return charge;
};
exports.generate_random_deposit_charge = generate_random_deposit_charge;
//# sourceMappingURL=generate_random_deposit_charge.js.map