"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_channel = void 0;
const e2e_1 = require("@nestia/e2e");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const generate_random_channel = async (pool, input) => {
    const channel = await index_1.default.functional.shoppings.admins.systematic.channels.create(pool.admin, {
        code: e2e_1.RandomGenerator.alphabets(16),
        name: e2e_1.RandomGenerator.name(8),
        ...input,
    });
    return channel;
};
exports.generate_random_channel = generate_random_channel;
//# sourceMappingURL=generate_random_channel.js.map