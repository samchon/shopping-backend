"use strict";
/* @ttsc-rewritten */
const { _isFormatDateTime: __typia_transform__isFormatDateTime } = require("typia/lib/internal/_isFormatDateTime");
const { _isFormatEmail: __typia_transform__isFormatEmail } = require("typia/lib/internal/_isFormatEmail");
const { _isFormatUuid: __typia_transform__isFormatUuid } = require("typia/lib/internal/_isFormatUuid");
const { _miscCloneAny: __typia_transform__miscCloneAny } = require("typia/lib/internal/_miscCloneAny");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_actor_customer_password_change = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const TestGlobal_1 = require("../../../../TestGlobal");
const test_api_shopping_actor_customer_create_1 = require("./test_api_shopping_actor_customer_create");
const test_api_shopping_actor_customer_join_1 = require("./test_api_shopping_actor_customer_join");
const test_api_shopping_actor_customer_password_change = async (pool) => {
    const joined = await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    const login = async (password) => {
        await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool);
        const authorized = await index_1.default.functional.shoppings.customers.authenticate.login(pool.customer, {
            email: joined.member.emails[0].value,
            password,
        });
        return authorized;
    };
    const first = await login(TestGlobal_1.TestGlobal.PASSWORD);
    validate("login", joined, first);
    await index_1.default.functional.shoppings.customers.authenticate.password.change(pool.customer, {
        oldbie: TestGlobal_1.TestGlobal.PASSWORD,
        newbie: NEW_PASSWORD,
    });
    await e2e_1.TestValidator.httpError("previous", 403, () => login(TestGlobal_1.TestGlobal.PASSWORD));
    const after = await login(NEW_PASSWORD);
    validate("after", joined, after);
    await index_1.default.functional.shoppings.customers.authenticate.password.change(pool.customer, {
        oldbie: NEW_PASSWORD,
        newbie: TestGlobal_1.TestGlobal.PASSWORD,
    });
    const again = await login(TestGlobal_1.TestGlobal.PASSWORD);
    validate("again", joined, again);
};
exports.test_api_shopping_actor_customer_password_change = test_api_shopping_actor_customer_password_change;
const validate = (title, x, y) => e2e_1.TestValidator.equals(title, (() => {
    const _co0 = (input) => ({
        type: input.type,
        member: input.member ? _co1(input.member) : input.member,
        citizen: input.citizen ? _co2(input.citizen) : input.citizen,
        channel: _co6(input.channel),
        external_user: input.external_user ? _co7(input.external_user) : input.external_user,
        href: input.href,
        referrer: input.referrer,
        ip: input.ip
    });
    const _co1 = (input) => ({
        citizen: input.citizen ? _co2(input.citizen) : input.citizen,
        seller: input.seller ? _co3(input.seller) : input.seller,
        administrator: input.administrator ? _co4(input.administrator) : input.administrator,
        id: input.id,
        nickname: input.nickname,
        emails: (() => input.emails.map((elem) => _co5(elem)))(),
        created_at: input.created_at
    });
    const _co2 = (input) => ({
        id: input.id,
        created_at: input.created_at,
        mobile: input.mobile,
        name: input.name
    });
    const _co3 = (input) => ({
        id: input.id,
        created_at: input.created_at
    });
    const _co4 = (input) => ({
        id: input.id,
        created_at: input.created_at
    });
    const _co5 = (input) => ({
        id: input.id,
        value: input.value,
        created_at: input.created_at
    });
    const _co6 = (input) => ({
        id: input.id,
        created_at: input.created_at,
        code: input.code,
        name: input.name
    });
    const _co7 = (input) => ({
        id: input.id,
        citizen: input.citizen ? _co2(input.citizen) : input.citizen,
        created_at: input.created_at,
        application: input.application,
        uid: input.uid,
        nickname: input.nickname,
        data: __typia_transform__miscCloneAny(input.data)
    });
    const _io1 = (input) => (null === input.citizen || "object" === typeof input.citizen && null !== input.citizen && _io2(input.citizen)) && (null === input.seller || "object" === typeof input.seller && null !== input.seller && _io3(input.seller)) && (null === input.administrator || "object" === typeof input.administrator && null !== input.administrator && _io4(input.administrator)) && ("string" === typeof input.id && __typia_transform__isFormatUuid(input.id)) && "string" === typeof input.nickname && (Array.isArray(input.emails) && input.emails.every((elem) => "object" === typeof elem && null !== elem && _io5(elem))) && ("string" === typeof input.created_at && __typia_transform__isFormatDateTime(input.created_at));
    const _io2 = (input) => "string" === typeof input.id && __typia_transform__isFormatUuid(input.id) && ("string" === typeof input.created_at && __typia_transform__isFormatDateTime(input.created_at)) && ("string" === typeof input.mobile && RegExp("^[0-9]*$").test(input.mobile)) && "string" === typeof input.name;
    const _io3 = (input) => "string" === typeof input.id && __typia_transform__isFormatUuid(input.id) && ("string" === typeof input.created_at && __typia_transform__isFormatDateTime(input.created_at));
    const _io4 = (input) => "string" === typeof input.id && __typia_transform__isFormatUuid(input.id) && ("string" === typeof input.created_at && __typia_transform__isFormatDateTime(input.created_at));
    const _io5 = (input) => "string" === typeof input.id && __typia_transform__isFormatUuid(input.id) && ("string" === typeof input.value && __typia_transform__isFormatEmail(input.value)) && ("string" === typeof input.created_at && __typia_transform__isFormatDateTime(input.created_at));
    const _io6 = (input) => "string" === typeof input.id && __typia_transform__isFormatUuid(input.id) && ("string" === typeof input.created_at && __typia_transform__isFormatDateTime(input.created_at)) && "string" === typeof input.code && "string" === typeof input.name;
    const _io7 = (input) => "string" === typeof input.id && __typia_transform__isFormatUuid(input.id) && (null === input.citizen || "object" === typeof input.citizen && null !== input.citizen && _io2(input.citizen)) && ("string" === typeof input.created_at && __typia_transform__isFormatDateTime(input.created_at)) && "string" === typeof input.application && "string" === typeof input.uid && "string" === typeof input.nickname && true;
    return (input) => _co0(input);
})()(x), y);
const NEW_PASSWORD = "something";
//# sourceMappingURL=test_api_shopping_actor_customer_password_change.js.map