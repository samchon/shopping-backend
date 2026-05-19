"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_sale_question_secret = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_actor_customer_join_1 = require("../actors/test_api_shopping_actor_customer_join");
const test_api_shopping_actor_seller_join_1 = require("../actors/test_api_shopping_actor_seller_join");
const generate_random_sale_1 = require("../sales/internal/generate_random_sale");
const generate_random_sale_question_1 = require("./internal/generate_random_sale_question");
const test_api_shopping_sale_question_secret = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await (0, test_api_shopping_actor_seller_join_1.test_api_shopping_actor_seller_join)(pool);
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const question = await (0, generate_random_sale_question_1.generate_random_sale_question)(pool, sale, {
        secret: true,
    });
    const validate = (type) => async (visible) => {
        if (visible) {
            const read = await index_1.default.functional.shoppings[`${type}s`].sales.questions.at(pool[type], sale.id, question.id);
            e2e_1.TestValidator.equals("read", question, read);
        }
        else
            await e2e_1.TestValidator.httpError(`read ${visible}`, 403, () => index_1.default.functional.shoppings[`${type}s`].sales.questions.at(pool[type], sale.id, question.id));
        const page = await index_1.default.functional.shoppings[`${type}s`].sales.questions.index(pool[type], sale.id, {
            limit: 1,
        });
        const summary = page.data[0];
        const masked = () => summary.customer.citizen.name.includes("*") &&
            summary.customer.citizen.mobile.includes("0") &&
            summary.title.includes("*");
        e2e_1.TestValidator.predicate(`page ${visible}`, visible ? () => !masked() : masked);
    };
    await validate("customer")(true);
    await (0, test_api_shopping_actor_customer_join_1.test_api_shopping_actor_customer_join)(pool);
    await validate("customer")(false);
    await validate("seller")(true);
    await validate("admin")(true);
};
exports.test_api_shopping_sale_question_secret = test_api_shopping_sale_question_secret;
//# sourceMappingURL=test_api_shopping_sale_question_secret.js.map