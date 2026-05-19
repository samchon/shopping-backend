"use strict";
/* @ttsc-rewritten */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_coupon_index_sort = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_coupon_1 = require("./internal/generate_random_coupon");
const prepare_random_coupon_1 = require("./internal/prepare_random_coupon");
const test_api_shopping_coupon_index_sort = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const prefix = e2e_1.RandomGenerator.name(50);
    const saleList = await e2e_1.ArrayUtil.asyncRepeat(10, () => (0, generate_random_sale_1.generate_random_sale)(pool));
    const generator = (sale) => (types) => (0, generate_random_coupon_1.generate_random_coupon)({
        direction: "include",
        customer: null,
        sale,
        types,
        create: (input) => index_1.default.functional.shoppings.admins.coupons.create(pool.admin, {
            ...input,
            name: `${prefix}-${e2e_1.RandomGenerator.name(10)}`,
        }),
        prepare: (criterias) => (0, prepare_random_coupon_1.prepare_random_coupon)({
            criterias,
            opened_at: new Date(Date.now() + (0, tstl_1.randint)(-5 * DAY, 0)).toISOString(),
            closed_at: new Date(Date.now() + (0, tstl_1.randint)(2 * DAY, 7 * DAY)).toISOString(),
            restriction: {
                expired_at: null,
                expired_in: (0, tstl_1.randint)(7, 28),
            },
        }),
    });
    const coupons = (await e2e_1.ArrayUtil.asyncMap(saleList, (sale) => e2e_1.ArrayUtil.asyncMap([
    "funnel",
    "sale",
    "section",
    "seller"
], (type) => generator(sale)([type])))).flat();
    const validator = e2e_1.TestValidator.sort("coupons.index with sort options", async (sort) => {
        const page = await index_1.default.functional.shoppings.admins.coupons.index(pool.admin, {
            search: {
                name: prefix,
            },
            sort,
            limit: coupons.length,
        });
        return page.data;
    });
    const components = [
        validator("coupon.name")(e2e_1.GaffComparator.strings((x) => x.name)),
        validator("coupon.value")(e2e_1.GaffComparator.numbers((x) => [x.discount.value])),
        validator("coupon.unit")(e2e_1.GaffComparator.strings((x) => [x.discount.unit])),
        validator("coupon.created_at")(e2e_1.GaffComparator.dates((x) => x.created_at)),
        validator("coupon.opened_at")(e2e_1.GaffComparator.strings((x) => x.opened_at ?? "2999-12-31")),
        validator("coupon.closed_at")(e2e_1.GaffComparator.strings((x) => x.closed_at ?? "2999-12-31")),
    ];
    for (const comp of components) {
        await comp("+");
        await comp("-");
    }
    for (const c of coupons)
        await index_1.default.functional.shoppings.admins.coupons.destroy(pool.admin, c.id);
};
exports.test_api_shopping_coupon_index_sort = test_api_shopping_coupon_index_sort;
const DAY = 1000 * 60 * 60 * 24;
//# sourceMappingURL=test_api_shopping_coupon_index_sort.js.map