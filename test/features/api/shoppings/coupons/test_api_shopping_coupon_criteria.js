"use strict";
/* @ttsc-rewritten */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_coupon_criteria = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_coupon_1 = require("./internal/generate_random_coupon");
const prepare_random_coupon_1 = require("./internal/prepare_random_coupon");
const test_api_shopping_coupon_criteria = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    const outside = await generate_group(pool, 0);
    const inside = await generate_group(pool, 1);
    for (const type of [
    "funnel",
    "sale",
    "section",
    "seller"
]) {
        await (0, generate_random_coupon_1.generate_random_coupon)({
            types: [type],
            direction: "include",
            customer: inside.customer,
            sale: inside.sale,
            create: (input) => index_1.default.functional.shoppings.admins.coupons.create(pool.admin, input),
            prepare: (criterias) => (0, prepare_random_coupon_1.prepare_random_coupon)({ criterias }),
        });
        await validate(pool, inside, true);
        await validate(pool, outside, false);
    }
};
exports.test_api_shopping_coupon_criteria = test_api_shopping_coupon_criteria;
const validate = async (pool, { customer, sale }, possible) => {
    Object.assign(pool.customer.headers, customer.setHeaders);
    try {
        sale = await index_1.default.functional.shoppings.customers.sales.at(pool.customer, sale.id);
    }
    catch {
        return;
    }
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const preview = await index_1.default.functional.shoppings.customers.carts.commodities.discountable(pool.customer, {
        commodity_ids: [commodity.id],
        pseudos: [],
    });
    e2e_1.TestValidator.equals("predicate on cart", possible, !!preview.combinations.length);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    const discountable = await index_1.default.functional.shoppings.customers.orders.discountable(pool.customer, order.id, {
        good_ids: null,
    });
    e2e_1.TestValidator.equals("predicate on order", possible, !!discountable.combinations.length);
};
const generate_group = async (pool, i) => {
    const section = await index_1.default.functional.shoppings.admins.systematic.sections.create(pool.admin, {
        name: e2e_1.RandomGenerator.name(),
        code: e2e_1.RandomGenerator.alphabets(16),
    });
    const customer = await index_1.default.functional.shoppings.customers.authenticate.create(pool.customer, {
        href: i === 0 ? "https://github.com" : "https://www.npmjs.com",
        referrer: i === 0 ? "https://www.google.com" : "https://www.naver.com",
        channel_code: pool.channel,
        external_user: null,
    });
    const activated = await index_1.default.functional.shoppings.customers.authenticate.activate(pool.customer, {
        mobile: e2e_1.RandomGenerator.mobile(),
        name: e2e_1.RandomGenerator.name(),
    });
    customer.citizen = activated.citizen;
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool, {
        section_code: section.code,
    });
    return { customer, sale };
};
//# sourceMappingURL=test_api_shopping_coupon_criteria.js.map