"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_cart_commodity = void 0;
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const prepare_random_cart_commodity_1 = require("./prepare_random_cart_commodity");
const generate_random_cart_commodity = async (pool, sale, input = {}) => {
    const item = await index_1.default.functional.shoppings.customers.carts.commodities.create(pool.customer, (0, prepare_random_cart_commodity_1.prepare_random_cart_commodity)(sale, input));
    return item;
};
exports.generate_random_cart_commodity = generate_random_cart_commodity;
//# sourceMappingURL=generate_random_cart_commodity.js.map