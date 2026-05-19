"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_systematic_channel_category_store = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const generate_random_channel_1 = require("./internal/generate_random_channel");
const test_api_shopping_systematic_channel_category_store = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    const channel = await (0, generate_random_channel_1.generate_random_channel)(pool);
    const input = prepare(0);
    const category = await generate(pool, channel, null, input);
    e2e_1.TestValidator.equals("category", input, category);
};
exports.test_api_shopping_systematic_channel_category_store = test_api_shopping_systematic_channel_category_store;
const prepare = (level) => ({
    code: e2e_1.RandomGenerator.alphabets(8),
    name: e2e_1.RandomGenerator.name(8),
    children: level < 2 ? e2e_1.ArrayUtil.repeat((0, tstl_1.randint)(0, 3), () => prepare(level + 1)) : [],
});
const generate = async (pool, channel, parent_id, input) => {
    const category = await index_1.default.functional.shoppings.admins.systematic.channels.categories.create(pool.admin, channel.code, {
        name: input.name,
        code: input.code,
        parent_id,
    });
    category.children = await e2e_1.ArrayUtil.asyncMap(input.children, (child) => generate(pool, channel, category.id, child));
    return category;
};
//# sourceMappingURL=test_api_shopping_systematic_channel_category_create.js.map