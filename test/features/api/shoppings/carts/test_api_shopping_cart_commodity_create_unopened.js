"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_cart_commodity_create_unopened = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const test_api_shopping_actor_customer_create_1 = require("../actors/test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_cart_commodity_1 = require("./internal/generate_random_cart_commodity");
const test_api_shopping_cart_commodity_create_unopened = async (pool) => {
    await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const opened_at = new Date(Date.now() + 5_000);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool, {
        opened_at: opened_at.toISOString(),
    });
    await e2e_1.TestValidator.httpError("not opened", 422, () => (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale));
    await (0, tstl_1.sleep_until)(opened_at);
    await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
};
exports.test_api_shopping_cart_commodity_create_unopened = test_api_shopping_cart_commodity_create_unopened;
//# sourceMappingURL=test_api_shopping_cart_commodity_create_unopened.js.map