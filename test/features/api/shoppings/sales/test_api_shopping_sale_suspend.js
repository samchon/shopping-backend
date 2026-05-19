"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_suspend = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_create_1 = require("../actors/test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("./internal/generate_random_sale");
const validate_sale_at_1 = require("./internal/validate_sale_at");
const validate_sale_index_1 = require("./internal/validate_sale_index");
const test_api_shopping_sale_suspend = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    await index_1.default.functional.shoppings.sellers.sales.suspend(pool.seller, sale.id);
    const read = await index_1.default.functional.shoppings.sellers.sales.at(pool.seller, sale.id);
    await (0, validate_sale_at_1.validate_sale_at)({
        pool,
        sale: read,
        visibleToCustomer: false,
    });
    await (0, validate_sale_index_1.validate_sale_index)({
        pool,
        sales: [read],
        visibleInCustomer: false,
    });
    e2e_1.TestValidator.equals("suspended_at", !!read.suspended_at, true);
    await index_1.default.functional.shoppings.sellers.sales.restore(pool.seller, sale.id);
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
};
exports.test_api_shopping_sale_suspend = test_api_shopping_sale_suspend;
//# sourceMappingURL=test_api_shopping_sale_suspend.js.map