"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare_random_attachment_file = void 0;
const e2e_1 = require("@nestia/e2e");
const prepare_random_attachment_file = (input) => ({
    name: e2e_1.RandomGenerator.alphabets(8),
    extension: e2e_1.RandomGenerator.alphabets(3),
    url: "https://picsum.photos/800/600?random",
    ...input,
});
exports.prepare_random_attachment_file = prepare_random_attachment_file;
//# sourceMappingURL=prepare_random_attachment_file.js.map