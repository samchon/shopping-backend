"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_section = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const generate_random_section = async (pool, input) => {
    const section = await index_1.default.functional.shoppings.admins.systematic.sections.create(pool.admin, {
        code: e2e_1.RandomGenerator.alphabets(16),
        name: e2e_1.RandomGenerator.name(8),
        ...input,
    });
    return section;
};
exports.generate_random_section = generate_random_section;
//# sourceMappingURL=generate_random_section.js.map