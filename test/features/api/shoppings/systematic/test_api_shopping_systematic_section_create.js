"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_systematic_section_create = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const generate_random_section_1 = require("./internal/generate_random_section");
const test_api_shopping_systematic_section_create = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    const section = await (0, generate_random_section_1.generate_random_section)(pool);
    const read = await index_1.default.functional.shoppings.admins.systematic.sections.at(pool.admin, section.id);
    e2e_1.TestValidator.equals("create", section, read);
};
exports.test_api_shopping_systematic_section_create = test_api_shopping_systematic_section_create;
//# sourceMappingURL=test_api_shopping_systematic_section_create.js.map