"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_sale = void 0;
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const prepare_random_sale_1 = require("./prepare_random_sale");
const generate_random_sale = async (pool, input) => {
    const sale = await index_1.default.functional.shoppings.sellers.sales.create(pool.seller, await (0, prepare_random_sale_1.prepare_random_sale)(pool, input));
    return sale;
};
exports.generate_random_sale = generate_random_sale;
//# sourceMappingURL=generate_random_sale.js.map