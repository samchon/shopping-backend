"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_actor_seller_join = void 0;
const e2e_1 = require("@nestia/e2e");
const shopping_api_1 = __importDefault(require("@samchon/shopping-api"));
const TestGlobal_1 = require("../../../../TestGlobal");
const test_api_shopping_actor_customer_create_1 = require("./test_api_shopping_actor_customer_create");
const test_api_shopping_actor_seller_join = async (pool, email) => {
    await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool, pool.seller);
    const input = {
        email: email ?? `${e2e_1.RandomGenerator.alphaNumeric(16)}@nestia.io`,
        password: TestGlobal_1.TestGlobal.PASSWORD,
        nickname: e2e_1.RandomGenerator.name(),
        citizen: {
            mobile: e2e_1.RandomGenerator.mobile(),
            name: e2e_1.RandomGenerator.name(),
        },
    };
    try {
        await shopping_api_1.default.functional.shoppings.customers.authenticate.join(pool.seller, input);
    }
    catch {
        return shopping_api_1.default.functional.shoppings.sellers.authenticate.login(pool.seller, {
            email: input.email,
            password: TestGlobal_1.TestGlobal.PASSWORD,
        });
    }
    const joined = await shopping_api_1.default.functional.shoppings.sellers.authenticate.join(pool.seller, {});
    const expected = {
        emails: [
            {
                value: input.email,
            },
        ],
    };
    e2e_1.TestValidator.equals("joined.member", expected, joined.member);
    e2e_1.TestValidator.equals("joined.citizen", input.citizen, joined.citizen);
    return joined;
};
exports.test_api_shopping_actor_seller_join = test_api_shopping_actor_seller_join;
//# sourceMappingURL=test_api_shopping_actor_seller_join.js.map