"use strict";
/* @ttsc-rewritten */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_actor_admin_password_change = void 0;
const e2e_1 = require("@nestia/e2e");
const shopping_api_1 = __importDefault(require("@samchon/shopping-api"));
const TestGlobal_1 = require("../../../../TestGlobal");
const test_api_shopping_actor_admin_login_1 = require("./test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_create_1 = require("./test_api_shopping_actor_customer_create");
const test_api_shopping_actor_admin_password_change = async (pool) => {
    const admin = await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    const login = async (password) => {
        await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool, pool.admin);
        const authorized = await shopping_api_1.default.functional.shoppings.admins.authenticate.login(pool.admin, {
            email: admin.member.emails[0].value,
            password,
        });
        return authorized;
    };
    const passed = await login(TestGlobal_1.TestGlobal.PASSWORD);
    const first = await login(TestGlobal_1.TestGlobal.PASSWORD);
    validate("login", passed, first);
    await shopping_api_1.default.functional.shoppings.customers.authenticate.password.change(pool.admin, {
        oldbie: TestGlobal_1.TestGlobal.PASSWORD,
        newbie: NEW_PASSWORD,
    });
    const after = await login(NEW_PASSWORD);
    validate("after", passed, after);
    await shopping_api_1.default.functional.shoppings.customers.authenticate.password.change(pool.admin, {
        oldbie: NEW_PASSWORD,
        newbie: TestGlobal_1.TestGlobal.PASSWORD,
    });
    const again = await login(TestGlobal_1.TestGlobal.PASSWORD);
    validate("again", passed, again);
};
exports.test_api_shopping_actor_admin_password_change = test_api_shopping_actor_admin_password_change;
const validate = (title, x, y) => e2e_1.TestValidator.equals(title, (() => {
    const _co0 = (input) => ({
        id: input.id,
        created_at: input.created_at
    });
    return (input) => _co0(input);
})()(x), y);
const NEW_PASSWORD = "something";
//# sourceMappingURL=test_api_shopping_actor_admin_password_change.js.map