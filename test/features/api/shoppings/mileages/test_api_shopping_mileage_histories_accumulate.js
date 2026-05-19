"use strict";
/* @ttsc-rewritten */
const { _assertGuard: __typia_transform__assertGuard } = require("typia/lib/internal/_assertGuard");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_mileage_histories_accumulate = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_mileage_histories_1 = require("./internal/generate_random_mileage_histories");
const test_api_shopping_mileage_histories_accumulate = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const customer = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const { donation, good } = await (0, generate_random_mileage_histories_1.generate_random_mileage_histories)(pool, customer);
    const histories = await index_1.default.functional.shoppings.customers.mileages.histories.index(pool.customer, {
        limit: 100,
        sort: ["+history.created_at"],
    });
    const getDefaultValue = async (code) => {
        const mileage = await index_1.default.functional.shoppings.admins.mileages.get(pool.admin, code);
        return (() => {
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
})()(mileage.value);
    };
    e2e_1.TestValidator.equals("histories[].value", histories.data.map((history) => history.value * history.mileage.direction), [
        donation.value,
        -donation.value,
        good.price.real *
            (await getDefaultValue("shopping_order_good_confirm_reward")),
        await getDefaultValue("shopping_sale_snapshot_review_photo_reward"),
    ]);
    e2e_1.TestValidator.equals("histories[].balance", histories.data.map((history) => history.balance), histories.data.map((history, i) => history.value * history.mileage.direction +
        histories.data
            .slice(0, i)
            .map((history) => history.value * history.mileage.direction)
            .reduce((a, b) => a + b, 0)));
};
exports.test_api_shopping_mileage_histories_accumulate = test_api_shopping_mileage_histories_accumulate;
//# sourceMappingURL=test_api_shopping_mileage_histories_accumulate.js.map