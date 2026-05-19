"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare_random_sale = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const TestGlobal_1 = require("../../../../../TestGlobal");
const prepare_random_attachment_file_1 = require("../../../common/internal/prepare_random_attachment_file");
const prepare_random_sale_unit_1 = require("./prepare_random_sale_unit");
const prepare_random_sale = async (pool, input) => ({
    section_code: TestGlobal_1.TestGlobal.SECTION,
    category_codes: await categories(pool),
    units: e2e_1.ArrayUtil.repeat((0, tstl_1.randint)(1, 3), () => (0, prepare_random_sale_unit_1.prepare_random_sale_unit)()),
    content: {
        title: e2e_1.RandomGenerator.paragraph(),
        body: e2e_1.RandomGenerator.content(),
        format: "txt",
        files: e2e_1.ArrayUtil.repeat((0, tstl_1.randint)(0, 3), () => (0, prepare_random_attachment_file_1.prepare_random_attachment_file)()),
        thumbnails: e2e_1.ArrayUtil.repeat((0, tstl_1.randint)(1, 3), () => (0, prepare_random_attachment_file_1.prepare_random_attachment_file)()),
    },
    opened_at: new Date().toISOString(),
    closed_at: null,
    tags: [],
    ...(input ?? {}),
});
exports.prepare_random_sale = prepare_random_sale;
const categories = async (pool) => {
    const channel = await index_1.default.functional.shoppings.sellers.systematic.channels.get(pool.seller, pool.channel);
    return channel.categories.map((c) => c.code);
};
//# sourceMappingURL=prepare_random_sale.js.map