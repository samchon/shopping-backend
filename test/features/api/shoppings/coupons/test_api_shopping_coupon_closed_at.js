"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_coupon_closed_at = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_coupon_1 = require("./internal/generate_random_coupon");
const prepare_random_coupon_1 = require("./internal/prepare_random_coupon");
const test_api_shopping_coupon_closed_at = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const closed_at = new Date(Date.now() + 5_000);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const coupon = await (0, generate_random_coupon_1.generate_random_coupon)({
        types: [],
        direction: "include",
        customer: null,
        sale,
        create: (input) => index_1.default.functional.shoppings.admins.coupons.create(pool.admin, input),
        prepare: (criterias) => (0, prepare_random_coupon_1.prepare_random_coupon)({
            criterias,
            name: e2e_1.RandomGenerator.name(64),
            opened_at: new Date().toISOString(),
            closed_at: closed_at.toISOString(),
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
        const read = async () => {
            await index_1.default.functional.shoppings[path].coupons.at(connection, coupon.id);
        };
        if (visible)
            await read();
        else
            await e2e_1.TestValidator.httpError("gone", 410, read);
    };
    await validate("admins", true);
    await validate("customers", true);
    await (0, tstl_1.sleep_until)(closed_at);
    await validate("admins", true);
    await validate("customers", false);
};
exports.test_api_shopping_coupon_closed_at = test_api_shopping_coupon_closed_at;
//# sourceMappingURL=test_api_shopping_coupon_closed_at.js.map