"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_order = void 0;
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const generate_random_order = async (pool, commodities, volume) => {
    const order = await index_1.default.functional.shoppings.customers.orders.create(pool.customer, {
        goods: commodities.map((commodity) => ({
            commodity_id: commodity.id,
            volume: (volume ?? ((commodity) => commodity.volume))(commodity),
        })),
    });
    return order;
};
exports.generate_random_order = generate_random_order;
//# sourceMappingURL=generate_random_order.js.map