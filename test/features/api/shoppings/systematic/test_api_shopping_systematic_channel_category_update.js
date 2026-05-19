"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_systematic_channel_category_update = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_systematic_channel_category_update = async (pool) => {
    const admin = await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    const channel = admin.customer.channel;
    const generate = async (parent) => {
        const child = await index_1.default.functional.shoppings.admins.systematic.channels.categories.create(pool.admin, channel.code, {
            parent_id: parent?.id ?? null,
            name: e2e_1.RandomGenerator.name(8),
            code: e2e_1.RandomGenerator.alphabets(8),
        });
        return child;
    };
    const left = await generate(null);
    const right = await generate(null);
    const child = await generate(left);
    await index_1.default.functional.shoppings.admins.systematic.channels.categories.update(pool.admin, channel.code, child.id, {
        parent_id: right.id,
        name: child.name,
        code: child.code,
    });
    const expected = [
        {
            name: left.name,
            children: [],
        },
        {
            name: right.name,
            children: [
                {
                    name: child.name,
                    children: [],
                },
            ],
        },
    ];
    const entire = await index_1.default.functional.shoppings.admins.systematic.channels.categories.index(pool.admin, channel.code);
    e2e_1.TestValidator.equals("update", expected, entire);
};
exports.test_api_shopping_systematic_channel_category_update = test_api_shopping_systematic_channel_category_update;
//# sourceMappingURL=test_api_shopping_systematic_channel_category_update.js.map