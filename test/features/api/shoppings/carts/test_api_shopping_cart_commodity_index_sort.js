"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_cart_commodity_index_sort = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_create_1 = require("../actors/test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_cart_commodity_1 = require("./internal/generate_random_cart_commodity");
const prepare_random_cart_commodity_1 = require("./internal/prepare_random_cart_commodity");
const test_api_shopping_cart_commodity_index_sort = async (pool) => {
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool);
    const sales = await e2e_1.ArrayUtil.asyncRepeat(REPEAT, () => (0, generate_random_sale_1.generate_random_sale)(pool));
    const cart = await e2e_1.ArrayUtil.asyncMap(sales, async (s) => {
        const input = (0, prepare_random_cart_commodity_1.prepare_random_cart_commodity)(s);
        input.volume = (0, tstl_1.randint)(1, 10);
        for (const stock of input.stocks)
            stock.quantity = (0, tstl_1.randint)(1, 10);
        return (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, s, input);
    });
    const validator = e2e_1.TestValidator.sort("sort", async (input) => {
        const page = await index_1.default.functional.shoppings.customers.carts.commodities.index(pool.customer, {
            limit: cart.length,
            sort: input,
        });
        return page.data;
    });
    const components = [
        validator("commodity.price")(e2e_1.GaffComparator.numbers((x) => x.price.real)),
        validator("commodity.volume")(e2e_1.GaffComparator.numbers((x) => x.volume)),
        validator("commodity.volumed_price")(e2e_1.GaffComparator.numbers((x) => x.price.real * x.volume)),
        validator("commodity.created_at")(e2e_1.GaffComparator.dates((x) => x.created_at)),
        validator("seller.created_at")(e2e_1.GaffComparator.dates((x) => x.sale.seller.created_at)),
        validator("sale.created_at")(e2e_1.GaffComparator.dates((x) => x.sale.created_at)),
        validator("sale.updated_at")(e2e_1.GaffComparator.dates((x) => x.sale.updated_at)),
        validator("sale.opened_at")(e2e_1.GaffComparator.dates((x) => x.sale.opened_at)),
        validator("sale.content.title")(e2e_1.GaffComparator.strings((x) => x.sale.content.title)),
    ];
    for (const comp of components) {
        await comp("+");
        await comp("-");
    }
};
exports.test_api_shopping_cart_commodity_index_sort = test_api_shopping_cart_commodity_index_sort;
const REPEAT = 25;
//# sourceMappingURL=test_api_shopping_cart_commodity_index_sort.js.map