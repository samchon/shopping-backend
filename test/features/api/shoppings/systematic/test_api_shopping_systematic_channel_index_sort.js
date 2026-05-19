"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_systematic_channel_index_sort = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const test_api_shopping_systematic_channel_index_sort = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    await e2e_1.ArrayUtil.asyncRepeat(REPEAT, async () => {
        const channel = await index_1.default.functional.shoppings.admins.systematic.channels.create(pool.admin, {
            code: e2e_1.RandomGenerator.alphabets(8),
            name: e2e_1.RandomGenerator.name(8),
        });
        return channel;
    });
    const validator = e2e_1.TestValidator.sort("channels.index", async (input) => {
        const page = await index_1.default.functional.shoppings.admins.systematic.channels.index(pool.admin, {
            limit: REPEAT,
            sort: input,
        });
        return page.data;
    });
    const components = [
        validator("channel.code")(e2e_1.GaffComparator.strings((s) => s.code)),
        validator("channel.name")(e2e_1.GaffComparator.strings((s) => s.name)),
        validator("channel.created_at")(e2e_1.GaffComparator.strings((s) => s.created_at)),
    ];
    for (const comp of components) {
        await comp("+");
        await comp("-");
    }
};
exports.test_api_shopping_systematic_channel_index_sort = test_api_shopping_systematic_channel_index_sort;
const REPEAT = 25;
//# sourceMappingURL=test_api_shopping_systematic_channel_index_sort.js.map