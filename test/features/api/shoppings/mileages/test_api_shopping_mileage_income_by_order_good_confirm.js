"use strict";
/* @ttsc-rewritten */
const { _assertGuard: __typia_transform__assertGuard } = require("typia/lib/internal/_assertGuard");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_mileage_income_by_order_good_confirm = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_order_publish_1 = require("../orders/internal/generate_random_order_publish");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const test_api_shopping_mileage_income_by_order_good_confirm = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
    await index_1.default.functional.shoppings.sellers.deliveries.create(pool.seller, {
        pieces: await index_1.default.functional.shoppings.sellers.deliveries.incompletes(pool.seller, {
            publish_ids: [order.publish.id],
        }),
        shippers: [],
        journeys: ["preparing", "manufacturing", "shipping", "delivering"].map((type) => ({
            type,
            title: null,
            description: null,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
        })),
    });
    const good = order.goods[0];
    await index_1.default.functional.shoppings.customers.orders.goods.confirm(pool.customer, order.id, good.id);
    const mileage = await index_1.default.functional.shoppings.admins.mileages.get(pool.admin, "shopping_order_good_confirm_reward");
    const balance = await index_1.default.functional.shoppings.customers.mileages.histories.balance(pool.customer);
    e2e_1.TestValidator.equals("balance", balance, good.price.real * (() => {
    const __is = (input) => "number" === typeof input;
    let _errorFactory;
    return (input, errorFactory) => {
        if (false === __is(input)) {
            _errorFactory = errorFactory;
            ((input, _path, _exceptionable = true) => "number" === typeof input || __typia_transform__assertGuard(true, {
                method: "assert",
                path: _path + "",
                expected: "number",
                value: input
            }, _errorFactory))(input, "$input", true);
        }
        return input;
    };
})()(mileage.value));
};
exports.test_api_shopping_mileage_income_by_order_good_confirm = test_api_shopping_mileage_income_by_order_good_confirm;
//# sourceMappingURL=test_api_shopping_mileage_income_by_order_good_confirm.js.map