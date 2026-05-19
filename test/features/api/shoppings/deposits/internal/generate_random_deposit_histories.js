"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_deposit_histories = void 0;
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const generate_random_cart_commodity_1 = require("../../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../../orders/internal/generate_random_order");
const generate_random_sole_sale_1 = require("../../sales/internal/generate_random_sole_sale");
const generate_random_deposit_charge_1 = require("./generate_random_deposit_charge");
const generate_random_deposit_charge_publish_1 = require("./generate_random_deposit_charge_publish");
const generate_random_deposit_histories = async (pool, props) => {
    const charge = await (0, generate_random_deposit_charge_1.generate_random_deposit_charge)(pool, {
        value: props.charge,
    });
    charge.publish = await (0, generate_random_deposit_charge_publish_1.generate_random_deposit_charge_publish)(pool, charge, true);
    const sale = await (0, generate_random_sole_sale_1.generate_random_sole_sale)(pool, {
        nominal: 10_000,
        real: 10_000,
    });
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    order.price =
        await index_1.default.functional.shoppings.customers.orders.discount(pool.customer, order.id, {
            deposit: props.discount,
            mileage: 0,
            coupon_ids: [],
        });
};
exports.generate_random_deposit_histories = generate_random_deposit_histories;
//# sourceMappingURL=generate_random_deposit_histories.js.map