"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_api_shopping_order_discountable = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const ShoppingGlobal_1 = require("../../../../../../src/ShoppingGlobal");
const test_api_shopping_actor_admin_login_1 = require("../../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../../carts/internal/generate_random_cart_commodity");
const prepare_random_coupon_1 = require("../../coupons/internal/prepare_random_coupon");
const generate_random_sole_sale_1 = require("../../sales/internal/generate_random_sole_sale");
const generate_random_section_1 = require("../../systematic/internal/generate_random_section");
const generate_random_order_1 = require("./generate_random_order");
const validate_api_shopping_order_discountable = (next) => async (pool) => {
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const saleList = await e2e_1.ArrayUtil.asyncRepeat(3, () => (0, generate_random_sole_sale_1.generate_random_sole_sale)(pool, {
        nominal: 50_000,
        real: 50_000,
    }));
    const commodities = await e2e_1.ArrayUtil.asyncMap(saleList, (sale) => (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale));
    const order = await (0, generate_random_order_1.generate_random_order)(pool, commodities, () => 1);
    const dummySection = await (0, generate_random_section_1.generate_random_section)(pool);
    const dummySeller = await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const generator = (exclusive) => async (criteria) => {
        const coupon = await index_1.default.functional.shoppings.admins.coupons.create(pool.admin, (0, prepare_random_coupon_1.prepare_random_coupon)({
            restriction: {
                exclusive,
                volume: null,
                volume_per_citizen: null,
            },
            discount: {
                unit: "amount",
                value: 5_000,
                multiplicative: false,
                threshold: null,
            },
            criterias: [...(criteria ? [criteria] : [])],
        }));
        return coupon;
    };
    const couponList = [
        await generator(true)(null),
        await generator(false)({
            type: "sale",
            direction: "include",
            sale_ids: [saleList[0].id],
        }),
        await generator(false)({
            type: "seller",
            direction: "include",
            seller_ids: [saleList[0].seller.id],
        }),
        await generator(false)({
            type: "section",
            direction: "include",
            section_codes: [saleList[0].section.code],
        }),
        await generator(true)({
            type: "section",
            direction: "include",
            section_codes: [dummySection.code],
        }),
        await generator(true)({
            type: "seller",
            direction: "include",
            seller_ids: [dummySeller.id],
        }),
    ];
    const discountable = await index_1.default.functional.shoppings.customers.orders.discountable(pool.customer, order.id, {
        good_ids: order.goods.map((g) => g.id),
    });
    try {
        e2e_1.TestValidator.equals("combinations.length", discountable.combinations.length, 2);
        e2e_1.TestValidator.equals("combinations[].amount", discountable.combinations.map((comb) => comb.amount), [15_000, 5_000]);
        e2e_1.TestValidator.equals("combinations[].coupons.length", discountable.combinations.map((comb) => comb.coupons.length), [3, 1]);
        if (next)
            await next(pool, {
                customer,
                sales: saleList,
                order,
                discountable,
                coupons: couponList,
                generator,
            });
    }
    finally {
        await ShoppingGlobal_1.ShoppingGlobal.prisma.shopping_sections.delete({
            where: {
                id: dummySection.id,
            },
        });
    }
};
exports.validate_api_shopping_order_discountable = validate_api_shopping_order_discountable;
//# sourceMappingURL=validate_api_shopping_order_discountable.js.map