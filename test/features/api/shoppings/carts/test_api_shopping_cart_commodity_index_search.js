"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_cart_commodity_index_search = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_customer_create_1 = require("../actors/test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_cart_commodity_1 = require("./internal/generate_random_cart_commodity");
const prepare_random_cart_commodity_1 = require("./internal/prepare_random_cart_commodity");
const test_api_shopping_cart_commodity_index_search = async (pool) => {
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
    const validator = e2e_1.TestValidator.search("search", async (input) => {
        const page = await index_1.default.functional.shoppings.customers.carts.commodities.index(pool.customer, {
            limit: cart.length,
            search: input,
        });
        return page.data;
    }, cart, 5);
    await validator({
        fields: ["min_price", "max_price"],
        values: (commodity) => [
            commodity.price.real * 0.9,
            commodity.price.real * 1.1,
        ],
        filter: (commodity, [min, max]) => min <= commodity.price.real && commodity.price.real <= max,
        request: ([min_price, max_price]) => ({ min_price, max_price }),
    });
    await validator({
        fields: ["min_volumed_price", "max_volumed_price"],
        values: (commodity) => [
            commodity.price.real * commodity.volume * 0.9,
            commodity.price.real * commodity.volume * 1.1,
        ],
        filter: (commodity, [min_volumed_price, max_volumed_price]) => min_volumed_price <= commodity.price.real * commodity.volume &&
            commodity.price.real * commodity.volume <= max_volumed_price,
        request: ([min_volumed_price, max_volumed_price]) => ({
            min_volumed_price,
            max_volumed_price,
        }),
    });
    await validator({
        fields: ["sale.content.title"],
        values: (commodity) => [commodity.sale.content.title],
        filter: (commodity, [title]) => commodity.sale.content.title.includes(title),
        request: ([title]) => ({ sale: { title } }),
    });
    await validator({
        fields: ["tags"],
        values: (commodity) => [commodity.sale.tags],
        request: ([tags]) => ({ sale: { tags } }),
        filter: (commodity, [tags]) => commodity.sale.tags.some((t) => tags.includes(t)),
    });
    await validator({
        fields: ["seller.id"],
        values: (commodity) => [commodity.sale.seller.id],
        request: ([id]) => ({ sale: { seller: { id } } }),
        filter: (commodity, [id]) => commodity.sale.seller.id === id,
    });
    await validator({
        fields: ["seller.name"],
        values: (commodity) => [commodity.sale.seller.citizen.name],
        request: ([name]) => ({ sale: { seller: { name } } }),
        filter: (commodity, [name]) => commodity.sale.seller.citizen.name === name,
    });
    await validator({
        fields: ["seller.mobile"],
        values: (commodity) => [commodity.sale.seller.citizen.mobile],
        request: ([mobile]) => ({ sale: { seller: { mobile } } }),
        filter: (commodity, [mobile]) => commodity.sale.seller.citizen.mobile === mobile,
    });
    await validator({
        fields: ["seller.email"],
        values: (commodity) => [commodity.sale.seller.member.emails[0].value],
        request: ([email]) => ({ sale: { seller: { email } } }),
        filter: (commodity, [value]) => commodity.sale.seller.member.emails.some((email) => email.value.includes(value)),
    });
    await validator({
        fields: ["seller.nickname"],
        values: (commodity) => [commodity.sale.seller.member.nickname],
        request: ([nickname]) => ({ sale: { seller: { nickname } } }),
        filter: (commodity, [nickname]) => commodity.sale.seller.member.nickname.includes(nickname),
    });
};
exports.test_api_shopping_cart_commodity_index_search = test_api_shopping_cart_commodity_index_search;
const REPEAT = 25;
//# sourceMappingURL=test_api_shopping_cart_commodity_index_search.js.map