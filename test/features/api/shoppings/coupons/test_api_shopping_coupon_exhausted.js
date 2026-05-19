"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_coupon_exhausted = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_coupon_1 = require("./internal/generate_random_coupon");
const prepare_random_coupon_1 = require("./internal/prepare_random_coupon");
const test_api_shopping_coupon_exhausted = async (pool) => {
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const coupon = await (0, generate_random_coupon_1.generate_random_coupon)({
        types: [],
        direction: "include",
        customer,
        sale,
        create: (input) => index_1.default.functional.shoppings.admins.coupons.create(pool.admin, input),
        prepare: (criterias) => (0, prepare_random_coupon_1.prepare_random_coupon)({
            criterias,
            name: e2e_1.RandomGenerator.name(64),
            restriction: {
                volume: 4,
                volume_per_citizen: null,
            },
        }),
    });
    const validate = async (path, visible) => {
        const connection = path === "admins"
            ? pool.admin
            : path === "customers"
                ? pool.customer
                : pool.seller;
        const page = await index_1.default.functional.shoppings[path].coupons.index(connection, {
            search: {
                name: coupon.name,
            },
            sort: ["-coupon.created_at"],
            limit: 1,
        });
        e2e_1.TestValidator.equals("visible", visible, coupon.id === page.data[0]?.id);
    };
    const ticketing = async () => {
        await index_1.default.functional.shoppings.customers.coupons.tickets.create(pool.customer, {
            coupon_id: coupon.id,
        });
    };
    await validate("admins", true);
    await validate("customers", true);
    await e2e_1.ArrayUtil.asyncRepeat(4, ticketing);
    await e2e_1.TestValidator.httpError("ticketing to exhausted", 410, ticketing);
    await validate("admins", true);
    await validate("customers", false);
};
exports.test_api_shopping_coupon_exhausted = test_api_shopping_coupon_exhausted;
//# sourceMappingURL=test_api_shopping_coupon_exhausted.js.map