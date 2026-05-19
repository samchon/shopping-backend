"use strict";
/* @ttsc-rewritten */
const { _assertGuard: __typia_transform__assertGuard } = require("typia/lib/internal/_assertGuard");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_mileage_income_by_review_of_photo = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const prepare_random_attachment_file_1 = require("../../common/internal/prepare_random_attachment_file");
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_cart_commodity_1 = require("../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../orders/internal/generate_random_order");
const generate_random_order_publish_1 = require("../orders/internal/generate_random_order_publish");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_sale_review_1 = require("../sales/internal/generate_random_sale_review");
const test_api_shopping_mileage_income_by_review_of_photo = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
    const good = order.goods[0];
    await (0, generate_random_sale_review_1.generate_random_sale_review)(pool, sale, good, {
        files: [(0, prepare_random_attachment_file_1.prepare_random_attachment_file)({ extension: "jpg" })],
    });
    const mileage = await index_1.default.functional.shoppings.admins.mileages.get(pool.admin, "shopping_sale_snapshot_review_photo_reward");
    const balance = await index_1.default.functional.shoppings.customers.mileages.histories.balance(pool.customer);
    e2e_1.TestValidator.equals("balance", balance, (() => {
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
exports.test_api_shopping_mileage_income_by_review_of_photo = test_api_shopping_mileage_income_by_review_of_photo;
//# sourceMappingURL=test_api_shopping_mileage_income_by_review_of_photo.js.map