"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare_random_bbs_article = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const prepare_random_attachment_file_1 = require("./prepare_random_attachment_file");
const prepare_random_bbs_article = (input) => ({
    format: "txt",
    title: e2e_1.RandomGenerator.paragraph(),
    body: e2e_1.RandomGenerator.content(),
    files: e2e_1.ArrayUtil.repeat((0, tstl_1.randint)(0, 3), () => (0, prepare_random_attachment_file_1.prepare_random_attachment_file)()),
    ...input,
});
exports.prepare_random_bbs_article = prepare_random_bbs_article;
//# sourceMappingURL=prepare_random_bbs_article.js.map