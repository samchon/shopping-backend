"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_delivery_incompletes = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const prepare_random_cart_commodity_stock_1 = require("../carts/internal/prepare_random_cart_commodity_stock");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_order_publish_1 = require("../orders/internal/generate_random_order_publish");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const prepare_random_sale_unit_1 = require("../sales/internal/prepare_random_sale_unit");
const test_api_shopping_delivery_incompletes = async (pool) => {
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const saleList = await e2e_1.ArrayUtil.asyncRepeat(REPEAT, async () => await (0, generate_random_sale_1.generate_random_sale)(pool, {
        units: new Array(REPEAT).fill(0).map(() => (0, prepare_random_sale_unit_1.prepare_random_sale_unit)()),
    }));
    const commodities = await e2e_1.ArrayUtil.asyncMap(saleList, (sale) => (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale, {
        volume: REPEAT / 4,
        stocks: sale.units.map((unit) => (0, prepare_random_cart_commodity_stock_1.prepare_random_cart_commodity_stock)(unit, { quantity: REPEAT / 4 })),
    }));
    const order = await (0, generate_random_order_1.generate_random_order)(pool, commodities);
    order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
    const left = {
        value: order.goods
            .map((good) => good.volume *
            good.commodity.sale.units
                .map((u) => u.stocks.map((s) => s.quantity))
                .flat()
                .flat()
                .reduce((a, b) => a + b, 0))
            .reduce((a, b) => a + b, 0),
    };
    while (left.value > 0) {
        const incompletes = await index_1.default.functional.shoppings.sellers.deliveries.incompletes(pool.seller, {
            publish_ids: [order.publish.id],
        });
        e2e_1.TestValidator.equals("left", left.value, incompletes.map((i) => i.quantity).reduce((a, b) => a + b, 0));
        const input = [];
        const quantity = Math.min(left.value, (0, tstl_1.randint)(1, 4));
        const remainder = { value: quantity };
        for (const i of incompletes) {
            const target = Math.min(i.quantity, remainder.value);
            input.push({
                ...i,
                quantity: target,
            });
            remainder.value -= target;
            if (remainder.value === 0)
                break;
        }
        const delivery = await index_1.default.functional.shoppings.sellers.deliveries.create(pool.seller, {
            journeys: [],
            shippers: [],
            pieces: input,
        });
        e2e_1.TestValidator.equals("quantity", quantity, delivery.pieces.map((i) => i.quantity).reduce((a, b) => a + b, 0));
        left.value -= quantity;
    }
    const incompletes = await index_1.default.functional.shoppings.sellers.deliveries.incompletes(pool.seller, {
        publish_ids: [order.publish.id],
    });
    e2e_1.TestValidator.equals("empty", incompletes.length, 0);
};
exports.test_api_shopping_delivery_incompletes = test_api_shopping_delivery_incompletes;
const REPEAT = 4;
//# sourceMappingURL=test_api_shopping_delivery_incompletes.js.map