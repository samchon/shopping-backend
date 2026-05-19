"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_cart_commodity_create_multiple = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const test_api_shopping_cart_commodity_create_multiple = async (pool) => {
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const commodity = await index_1.default.functional.shoppings.customers.carts.commodities.create(pool.customer, {
        sale_id: sale.id,
        stocks: sale.units.map((unit) => ({
            unit_id: unit.id,
            stock_id: e2e_1.RandomGenerator.pick(unit.stocks).id,
            choices: [],
            quantity: 1,
        })),
        volume: 1,
    });
    e2e_1.TestValidator.equals("length", sale.units.length, commodity.sale.units.map((u) => u.stocks.length).reduce((a, b) => a + b, 0));
};
exports.test_api_shopping_cart_commodity_create_multiple = test_api_shopping_cart_commodity_create_multiple;
//# sourceMappingURL=test_api_shopping_cart_commodity_create_multiple.js.map