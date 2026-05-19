"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_delivery_state = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_order_publish_1 = require("../orders/internal/generate_random_order_publish");
const generate_random_sole_sale_1 = require("../sales/internal/generate_random_sole_sale");
const test_api_shopping_delivery_state = async (pool) => {
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const saleList = await e2e_1.ArrayUtil.asyncRepeat(2, () => (0, generate_random_sole_sale_1.generate_random_sole_sale)(pool, {
        nominal: 100_000,
        real: 50_000,
    }));
    const commodities = await e2e_1.ArrayUtil.asyncMap(saleList, (sale) => (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale, {
        volume: 2,
        stocks: [
            {
                unit_id: sale.units[0].id,
                stock_id: sale.units[0].stocks[0].id,
                choices: [],
                quantity: 2,
            },
        ],
    }));
    const order = await (0, generate_random_order_1.generate_random_order)(pool, commodities, () => 2);
    order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
    const validate = async (states) => {
        const read = await index_1.default.functional.shoppings.customers.orders.at(pool.customer, order.id);
        e2e_1.TestValidator.equals("states", [read.publish.state, ...read.goods.map((g) => g.state)], states);
    };
    await validate(["none", "none", "none"]);
    const deliveries = await e2e_1.ArrayUtil.asyncRepeat(8, async (i) => {
        const good = order.goods[Math.floor(i / 4)];
        const delivery = await index_1.default.functional.shoppings.sellers.deliveries.create(pool.seller, {
            shippers: [],
            journeys: [
                {
                    type: "preparing",
                    title: "title",
                    description: "description",
                    started_at: new Date().toISOString(),
                    completed_at: null,
                },
            ],
            pieces: [
                {
                    publish_id: order.publish.id,
                    good_id: good.id,
                    stock_id: good.commodity.sale.units[0].stocks[0].id,
                    quantity: 1,
                },
            ],
        });
        await validate([
            i === 7 ? "preparing" : "underway",
            i >= 3 ? "preparing" : "underway",
            i < 4 ? "none" : i === 7 ? "preparing" : "underway",
        ]);
        return delivery;
    });
    await e2e_1.ArrayUtil.asyncMap(TYPES, async (current, i) => {
        const prev = i === 0 ? "preparing" : TYPES[i - 1];
        await e2e_1.ArrayUtil.asyncMap(deliveries, async (delivery, j) => {
            const journey = await index_1.default.functional.shoppings.sellers.deliveries.journeys.create(pool.seller, delivery.id, {
                type: current,
                title: null,
                description: null,
                started_at: new Date().toISOString(),
                completed_at: null,
            });
            delivery.journeys.push(journey);
            await validate([
                j === 7 ? current : prev,
                j >= 3 ? current : prev,
                j === 7 ? current : prev,
            ]);
        });
    });
    await e2e_1.ArrayUtil.asyncMap(deliveries, async (delivery, i) => {
        const last = delivery.journeys.at(-1);
        await index_1.default.functional.shoppings.sellers.deliveries.journeys.complete(pool.seller, delivery.id, last.id, {
            completed_at: new Date().toISOString(),
        });
        await validate([
            i === deliveries.length - 1 ? "arrived" : "delivering",
            i >= 3 ? "arrived" : "delivering",
            i === 7 ? "arrived" : "delivering",
        ]);
    });
};
exports.test_api_shopping_delivery_state = test_api_shopping_delivery_state;
const TYPES = ["manufacturing", "shipping", "delivering"];
//# sourceMappingURL=test_api_shopping_delivery_state.js.map