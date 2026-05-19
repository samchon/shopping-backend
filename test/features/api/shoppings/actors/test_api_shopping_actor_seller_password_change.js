"use strict";
/* @ttsc-rewritten */
const { _isFormatDateTime: __typia_transform__isFormatDateTime } = require("typia/lib/internal/_isFormatDateTime");
const { _isFormatEmail: __typia_transform__isFormatEmail } = require("typia/lib/internal/_isFormatEmail");
const { _isFormatUuid: __typia_transform__isFormatUuid } = require("typia/lib/internal/_isFormatUuid");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_actor_seller_password_change = void 0;
const e2e_1 = require("@nestia/e2e");
const shopping_api_1 = __importDefault(require("@samchon/shopping-api"));
const TestGlobal_1 = require("../../../../TestGlobal");
const test_api_shopping_actor_customer_create_1 = require("./test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join_1 = require("./test_api_shopping_actor_seller_join");
const test_api_shopping_actor_seller_password_change = async (pool) => {
    const joined = await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const login = async (password) => {
        await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool, pool.seller);
        const authorized = await shopping_api_1.default.functional.shoppings.sellers.authenticate.login(pool.seller, {
            email: joined.member.emails[0].value,
            password,
        });
        return authorized;
    };
    const first = await login(TestGlobal_1.TestGlobal.PASSWORD);
    validate("login")(joined)(first);
    await shopping_api_1.default.functional.shoppings.customers.authenticate.password.change(pool.seller, {
        oldbie: TestGlobal_1.TestGlobal.PASSWORD,
        newbie: NEW_PASSWORD,
    });
    await e2e_1.TestValidator.httpError("previous", 403, () => login(TestGlobal_1.TestGlobal.PASSWORD));
    const after = await login(NEW_PASSWORD);
    validate("after")(joined)(after);
    await shopping_api_1.default.functional.shoppings.customers.authenticate.password.change(pool.seller, {
        oldbie: NEW_PASSWORD,
        newbie: TestGlobal_1.TestGlobal.PASSWORD,
    });
    const again = await login(TestGlobal_1.TestGlobal.PASSWORD);
    validate("again")(joined)(again);
};
exports.test_api_shopping_actor_seller_password_change = test_api_shopping_actor_seller_password_change;
const validate = (title) => (x) => (y) => e2e_1.TestValidator.equals(title, (() => {
    const _co0 = (input) => ({
        id: input.id,
        created_at: input.created_at,
        type: input.type,
        member: _co1(input.member),
        citizen: _co3(input.citizen)
    });
    const _co1 = (input) => ({
        id: input.id,
        nickname: input.nickname,
        emails: (() => input.emails.map((elem) => _co2(elem)))(),
        created_at: input.created_at
    });
    const _co2 = (input) => ({
        id: input.id,
        value: input.value,
        created_at: input.created_at
    });
    const _co3 = (input) => ({
        id: input.id,
        created_at: input.created_at,
        mobile: input.mobile,
        name: input.name
    });
    const _io1 = (input) => "string" === typeof input.id && __typia_transform__isFormatUuid(input.id) && "string" === typeof input.nickname && (Array.isArray(input.emails) && input.emails.every((elem) => "object" === typeof elem && null !== elem && _io2(elem))) && ("string" === typeof input.created_at && __typia_transform__isFormatDateTime(input.created_at));
    const _io2 = (input) => "string" === typeof input.id && __typia_transform__isFormatUuid(input.id) && ("string" === typeof input.value && __typia_transform__isFormatEmail(input.value)) && ("string" === typeof input.created_at && __typia_transform__isFormatDateTime(input.created_at));
    const _io3 = (input) => "string" === typeof input.id && __typia_transform__isFormatUuid(input.id) && ("string" === typeof input.created_at && __typia_transform__isFormatDateTime(input.created_at)) && ("string" === typeof input.mobile && RegExp("^[0-9]*$").test(input.mobile)) && "string" === typeof input.name;
    return (input) => _co0(input);
})()(x), y);
const NEW_PASSWORD = "something";
//# sourceMappingURL=test_api_shopping_actor_seller_password_change.js.map