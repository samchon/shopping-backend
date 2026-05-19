"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare_random_cart_commodity_stock = void 0;
const e2e_1 = require("@nestia/e2e");
const prepare_random_cart_commodity_stock = (unit, input = {}) => {
    const stock = e2e_1.RandomGenerator.pick(unit.stocks);
    return {
        unit_id: unit.id,
        stock_id: stock.id,
        choices: [],
        quantity: 1,
        ...input,
    };
};
exports.prepare_random_cart_commodity_stock = prepare_random_cart_commodity_stock;
//# sourceMappingURL=prepare_random_cart_commodity_stock.js.map