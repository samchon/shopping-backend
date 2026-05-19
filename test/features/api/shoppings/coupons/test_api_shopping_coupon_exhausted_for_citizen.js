"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_coupon_exhausted_for_citizen = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_coupon_1 = require("./internal/generate_random_coupon");
const prepare_random_coupon_1 = require("./internal/prepare_random_coupon");
const test_api_shopping_coupon_exhausted_for_citizen = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const coupon = await (0, generate_random_coupon_1.generate_random_coupon)({
        types: [],
        direction: "include",
        customer: null,
        sale,
        create: (input) => index_1.default.functional.shoppings.admins.coupons.create(pool.admin, input),
        prepare: (criterias) => (0, prepare_random_coupon_1.prepare_random_coupon)({
            criterias,
            restriction: {
                volume: null,
                volume_per_citizen: 1,
            },
        }),
    });
    const ticketing = async () => {
        await index_1.default.functional.shoppings.customers.coupons.tickets.create(pool.customer, {
            coupon_id: coupon.id,
        });
    };
    await ticketing();
    await e2e_1.TestValidator.httpError("ticketing to exhausted", 410, ticketing);
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await ticketing();
};
exports.test_api_shopping_coupon_exhausted_for_citizen = test_api_shopping_coupon_exhausted_for_citizen;
//# sourceMappingURL=test_api_shopping_coupon_exhausted_for_citizen.js.map