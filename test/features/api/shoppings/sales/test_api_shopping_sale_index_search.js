"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_index_search = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_create_1 = require("../actors/test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("./internal/generate_random_sale");
const test_api_shopping_sale_index_search = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool);
    await e2e_1.ArrayUtil.asyncRepeat(25, async () => {
        await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
        await (0, generate_random_sale_1.generate_random_sale)(pool);
    });
    const total = await index_1.default.functional.shoppings.customers.sales.index(pool.customer, {
        limit: REPEAT,
        sort: ["-sale.created_at"],
    });
    const search = e2e_1.TestValidator.search("sales.index", async (input) => {
        const page = await index_1.default.functional.shoppings.customers.sales.index(pool.customer, {
            limit: total.data.length,
            search: input,
            sort: ["-sale.created_at"],
        });
        return page.data;
    }, total.data, 4);
    if (total.data.every((sale) => sale.categories.length))
        await search({
            fields: ["channel_category_ids"],
            values: (sale) => [sale.categories.map((c) => c.id)],
            request: ([channel_category_ids]) => ({ channel_category_ids }),
            filter: (sale, [ids]) => sale.categories.some((c) => ids.includes(c.id)),
        });
    await search({
        fields: ["sale.content.title"],
        values: (sale) => [e2e_1.RandomGenerator.pick(sale.content.title.split(" "))],
        request: ([title]) => ({ title }),
        filter: (sale, [title]) => sale.content.title.includes(title),
    });
    await search({
        fields: ["tags"],
        values: (sale) => [sale.tags],
        request: ([tags]) => ({ tags }),
        filter: (sale, [tags]) => sale.tags.some((t) => tags.includes(t)),
    });
    await search({
        fields: ["seller.id"],
        values: (sale) => [sale.seller.id],
        request: ([id]) => ({ seller: { id } }),
        filter: (sale, [id]) => sale.seller.id === id,
    });
    await search({
        fields: ["seller.name"],
        values: (sale) => [sale.seller.citizen.name],
        request: ([name]) => ({ seller: { name } }),
        filter: (sale, [name]) => sale.seller.citizen.name === name,
    });
    await search({
        fields: ["seller.mobile"],
        values: (sale) => [sale.seller.citizen.mobile],
        request: ([mobile]) => ({ seller: { mobile } }),
        filter: (sale, [mobile]) => sale.seller.citizen.mobile === mobile,
    });
    await search({
        fields: ["seller.nickname"],
        values: (sale) => [sale.seller.member.nickname],
        request: ([nickname]) => ({ seller: { nickname } }),
        filter: (sale, [nickname]) => sale.seller.member.nickname.includes(nickname),
    });
};
exports.test_api_shopping_sale_index_search = test_api_shopping_sale_index_search;
const REPEAT = 10;
//# sourceMappingURL=test_api_shopping_sale_index_search.js.map