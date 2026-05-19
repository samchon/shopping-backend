"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_systematic_section_index_search = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const test_api_shopping_actor_admin_login_1 = require("../actors/test_api_shopping_actor_admin_login");
const generate_random_section_1 = require("./internal/generate_random_section");
const test_api_shopping_systematic_section_index_search = async (pool) => {
    await (0, test_api_shopping_actor_admin_login_1.test_api_shopping_actor_admin_login)(pool);
    const sectionList = await e2e_1.ArrayUtil.asyncRepeat(REPEAT, () => (0, generate_random_section_1.generate_random_section)(pool));
    const search = e2e_1.TestValidator.search("sales.index", async (input) => {
        const page = await index_1.default.functional.shoppings.admins.systematic.sections.index(pool.admin, {
            limit: sectionList.length,
            search: input,
            sort: ["-section.created_at"],
        });
        return page.data;
    }, sectionList, 4);
    await search({
        fields: ["sectiob.name"],
        values: (section) => [section.name],
        request: ([name]) => ({ name }),
        filter: (section, [name]) => section.name.includes(name),
    });
};
exports.test_api_shopping_systematic_section_index_search = test_api_shopping_systematic_section_index_search;
const REPEAT = 25;
//# sourceMappingURL=test_api_shopping_systematic_section_index_search.js.map