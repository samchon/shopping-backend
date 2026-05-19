"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_systematic_channel_index_search = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const generate_random_channel_1 = require("./internal/generate_random_channel");
const test_api_shopping_systematic_channel_index_search = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    const channelList = await e2e_1.ArrayUtil.asyncRepeat(REPEAT, () => (0, generate_random_channel_1.generate_random_channel)(pool));
    const search = e2e_1.TestValidator.search("sales.index", async (input) => {
        const page = await index_1.default.functional.shoppings.admins.systematic.channels.index(pool.admin, {
            limit: channelList.length,
            search: input,
            sort: ["-channel.created_at"],
        });
        return page.data;
    }, channelList, 4);
    await search({
        fields: ["channel.name"],
        values: (channel) => [channel.name],
        request: ([name]) => ({ name }),
        filter: (channel, [name]) => channel.name.includes(name),
    });
};
exports.test_api_shopping_systematic_channel_index_search = test_api_shopping_systematic_channel_index_search;
const REPEAT = 25;
//# sourceMappingURL=test_api_shopping_systematic_channel_index_search.js.map