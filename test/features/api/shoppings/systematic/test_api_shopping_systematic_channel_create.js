"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_systematic_channel_create = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const generate_random_channel_1 = require("./internal/generate_random_channel");
const test_api_shopping_systematic_channel_create = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    const channel = await (0, generate_random_channel_1.generate_random_channel)(pool);
    const read = await index_1.default.functional.shoppings.admins.systematic.channels.at(pool.admin, channel.id);
    e2e_1.TestValidator.equals("create", channel, read);
};
exports.test_api_shopping_systematic_channel_create = test_api_shopping_systematic_channel_create;
//# sourceMappingURL=test_api_shopping_systematic_channel_create.js.map