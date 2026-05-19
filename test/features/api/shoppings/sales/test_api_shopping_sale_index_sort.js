"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_index_sort = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_create_1 = require("../actors/test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_order_publish_1 = require("../orders/internal/generate_random_order_publish");
const generate_random_sale_1 = require("./internal/generate_random_sale");
const generate_random_sale_review_1 = require("./internal/generate_random_sale_review");
const test_api_shopping_sale_index_sort = async (pool) => {
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const customer = await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool);
    await e2e_1.ArrayUtil.asyncRepeat(REPEAT, async () => {
        const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
        if (1 == 2) {
            const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
            const order = await (0, generate_random_order_1.generate_random_order)(pool, [
                commodity,
            ]);
            order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
            const good = order.goods[0];
            await (0, generate_random_sale_review_1.generate_random_sale_review)(pool, sale, good);
        }
    });
    const validator = e2e_1.TestValidator.sort("sort", async (sort) => {
        const page = await index_1.default.functional.shoppings.customers.sales.index(pool.customer, {
            limit: 5,
            sort,
        });
        return page.data;
    });
    const components = [
        validator("seller.created_at")(e2e_1.GaffComparator.dates((x) => x.seller.created_at)),
        validator("sale.created_at")(e2e_1.GaffComparator.dates((x) => x.created_at)),
        validator("sale.updated_at")(e2e_1.GaffComparator.dates((x) => x.updated_at)),
        validator("sale.opened_at")(e2e_1.GaffComparator.dates((x) => x.opened_at)),
        validator("sale.content.title")(e2e_1.GaffComparator.strings((x) => x.content.title)),
        validator("sale.price_range.lowest.real")(e2e_1.GaffComparator.numbers((x) => x.price_range.lowest.real)),
        validator("sale.price_range.highest.real")(e2e_1.GaffComparator.numbers((x) => x.price_range.highest.real)),
    ];
    for (const comp of components) {
        await comp("+");
        await comp("-");
    }
};
exports.test_api_shopping_sale_index_sort = test_api_shopping_sale_index_sort;
const REPEAT = 10;
//# sourceMappingURL=test_api_shopping_sale_index_sort.js.map