"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_supplement = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const prepare_random_sale_1 = require("./internal/prepare_random_sale");
const test_api_shopping_sale_supplement = async (pool) => {
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const input = await (0, prepare_random_sale_1.prepare_random_sale)(pool);
    for (const unit of input.units)
        for (const stock of unit.stocks)
            stock.quantity = 100;
    const sale = await index_1.default.functional.shoppings.sellers.sales.create(pool.seller, input);
    const unit = e2e_1.RandomGenerator.pick(sale.units);
    const stock = e2e_1.RandomGenerator.pick(unit.stocks);
    const supplements = await e2e_1.ArrayUtil.asyncRepeat(4, () => index_1.default.functional.shoppings.sellers.sales.units.stocks.supplements.create(pool.seller, sale.id, unit.id, stock.id, {
        value: 100,
    }));
    const page = await index_1.default.functional.shoppings.sellers.sales.units.stocks.supplements.index(pool.seller, sale.id, unit.id, stock.id, {
        limit: 10,
        sort: ["+created_at"],
    });
    e2e_1.TestValidator.equals("supplements", supplements, page.data);
    const reload = await index_1.default.functional.shoppings.sellers.sales.at(pool.seller, sale.id);
    const stockAgain = reload.units
        .find((u) => u.id === unit.id)
        ?.stocks.find((s) => s.id === stock.id);
    if (stockAgain === undefined)
        throw new Error("Failed to find the matched stock");
    e2e_1.TestValidator.equals("inventory.income", 500, stockAgain.inventory.income);
};
exports.test_api_shopping_sale_supplement = test_api_shopping_sale_supplement;
//# sourceMappingURL=test_api_shopping_sale_supplement.js.map