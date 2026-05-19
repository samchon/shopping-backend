"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare_random_bbs_article_comment = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const prepare_random_attachment_file_1 = require("./prepare_random_attachment_file");
const prepare_random_bbs_article_comment = (input) => ({
    format: "txt",
    body: e2e_1.RandomGenerator.content(),
    files: e2e_1.ArrayUtil.repeat((0, tstl_1.randint)(0, 3), () => (0, prepare_random_attachment_file_1.prepare_random_attachment_file)()),
    ...input,
});
exports.prepare_random_bbs_article_comment = prepare_random_bbs_article_comment;
//# sourceMappingURL=prepare_random_bbs_article_comment.js.map