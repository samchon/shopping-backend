"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_cart_commodity_create_accumulate = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_create_1 = require("../actors/test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_cart_commodity_1 = require("./internal/generate_random_cart_commodity");
const prepare_random_cart_commodity_1 = require("./internal/prepare_random_cart_commodity");
const test_api_shopping_cart_commodity_create_accumulate = async (pool) => {
    await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const input = {
        ...(0, prepare_random_cart_commodity_1.prepare_random_cart_commodity)(sale),
        volume: 1,
    };
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale, input);
    await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale, input);
    await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale, {
        ...input,
        accumulate: true,
    });
    const page = await index_1.default.functional.shoppings.customers.carts.commodities.index(pool.customer, {
        limit: 3,
        sort: ["-commodity.created_at"],
    });
    e2e_1.TestValidator.equals("data", page.data, [
        {
            ...commodity,
            volume: 3,
        },
    ]);
    const newbie = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale, {
        ...input,
        accumulate: false,
    });
    const reloaded = await index_1.default.functional.shoppings.customers.carts.commodities.index(pool.customer, {
        limit: 3,
        sort: ["-commodity.created_at"],
    });
    e2e_1.TestValidator.equals("reloaded", reloaded.data, [
        newbie,
        {
            ...commodity,
            volume: 3,
        },
    ]);
};
exports.test_api_shopping_cart_commodity_create_accumulate = test_api_shopping_cart_commodity_create_accumulate;
//# sourceMappingURL=test_api_shopping_cart_commodity_create_accumulate.js.map