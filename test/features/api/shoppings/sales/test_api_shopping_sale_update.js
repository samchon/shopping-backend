"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_update = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_create_1 = require("../actors/test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("./internal/generate_random_sale");
const prepare_random_sale_1 = require("./internal/prepare_random_sale");
const test_api_shopping_sale_update = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const total = [
        sale,
        ...(await e2e_1.ArrayUtil.asyncRepeat(3, async () => index_1.default.functional.shoppings.sellers.sales.update(pool.seller, sale.id, await (0, prepare_random_sale_1.prepare_random_sale)(pool)))),
    ];
    total.forEach((sale, i) => (sale.latest = i === total.length - 1));
    const read = await e2e_1.ArrayUtil.asyncMap(total, (s) => index_1.default.functional.shoppings.sellers.sales.snapshots.flip(pool.seller, sale.id, s.snapshot_id));
    e2e_1.TestValidator.equals("snapshots", total, read);
    const readByCustomer = await index_1.default.functional.shoppings.customers.sales.at(pool.customer, sale.id);
    e2e_1.TestValidator.equals("byCustomer", total.at(-1), readByCustomer);
};
exports.test_api_shopping_sale_update = test_api_shopping_sale_update;
//# sourceMappingURL=test_api_shopping_sale_update.js.map