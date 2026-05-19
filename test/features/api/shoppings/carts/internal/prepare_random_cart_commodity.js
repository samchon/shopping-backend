"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare_random_cart_commodity = void 0;
const prepare_random_cart_commodity_stock_1 = require("./prepare_random_cart_commodity_stock");
const prepare_random_cart_commodity = (sale, input = {}) => ({
    sale_id: sale.id,
    stocks: sale.units.map((unit) => (0, prepare_random_cart_commodity_stock_1.prepare_random_cart_commodity_stock)(unit)),
    volume: 1,
    ...input,
});
exports.prepare_random_cart_commodity = prepare_random_cart_commodity;
//# sourceMappingURL=prepare_random_cart_commodity.js.map