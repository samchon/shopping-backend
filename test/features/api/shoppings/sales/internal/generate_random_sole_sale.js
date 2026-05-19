"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_sole_sale = void 0;
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const prepare_random_sale_1 = require("./prepare_random_sale");
const generate_random_sole_sale = async (pool, price, quantity) => {
    const sale = await index_1.default.functional.shoppings.sellers.sales.create(pool.seller, await prepare_random_sole_sale(pool, price, quantity));
    return sale;
};
exports.generate_random_sole_sale = generate_random_sole_sale;
const prepare_random_sole_sale = async (pool, price, quantity) => {
    const sale = await (0, prepare_random_sale_1.prepare_random_sale)(pool);
    const unit = sale.units[0];
    const stock = unit.stocks[0];
    sale.units = [unit];
    unit.stocks = [stock];
    stock.price = price;
    if (quantity !== undefined)
        stock.quantity = quantity;
    unit.options = [];
    stock.choices = [];
    return sale;
};
//# sourceMappingURL=generate_random_sole_sale.js.map