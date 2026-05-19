"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_closed_at = void 0;
const tstl_1 = require("tstl");
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_create_1 = require("../actors/test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("./internal/generate_random_sale");
const validate_sale_at_1 = require("./internal/validate_sale_at");
const validate_sale_index_1 = require("./internal/validate_sale_index");
const test_api_shopping_sale_closed_at = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool);
    const closed_at = new Date(Date.now() + 5_000);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool, {
        opened_at: new Date().toISOString(),
        closed_at: closed_at.toISOString(),
    });
    await (0, validate_sale_at_1.validate_sale_at)({
        pool,
        sale,
        visibleToCustomer: true,
    });
    await (0, validate_sale_index_1.validate_sale_index)({
        pool,
        sales: [sale],
        visibleInCustomer: true,
    });
    await (0, tstl_1.sleep_until)(closed_at);
    await (0, validate_sale_at_1.validate_sale_at)({
        pool,
        sale,
        visibleToCustomer: false,
    });
    await (0, validate_sale_index_1.validate_sale_index)({
        pool,
        sales: [sale],
        visibleInCustomer: false,
    });
};
exports.test_api_shopping_sale_closed_at = test_api_shopping_sale_closed_at;
//# sourceMappingURL=test_api_shopping_sale_closed_at.js.map