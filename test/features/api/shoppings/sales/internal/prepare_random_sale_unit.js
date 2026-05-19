"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare_random_sale_unit = void 0;
const e2e_1 = require("@nestia/e2e");
const cagen_1 = require("cagen");
const tstl_1 = require("tstl");
const prepare_random_sale_unit = (input) => {
    const candidateCountMatrix = e2e_1.ArrayUtil.repeat((0, tstl_1.randint)(1, 3), () => (0, tstl_1.randint)(1, 4));
    const cartesian = new cagen_1.CartesianProduct(...candidateCountMatrix);
    return {
        name: e2e_1.RandomGenerator.name(),
        primary: true,
        required: true,
        options: candidateCountMatrix.map((count) => ({
            name: e2e_1.RandomGenerator.name((0, tstl_1.randint)(4, 8)),
            type: "select",
            variable: true,
            candidates: e2e_1.ArrayUtil.repeat(count, () => ({
                name: e2e_1.RandomGenerator.name((0, tstl_1.randint)(3, 12)),
            })),
        })),
        stocks: cartesian.map((indexes) => ({
            name: e2e_1.RandomGenerator.name((0, tstl_1.randint)(4, 12)),
            price: price(),
            choices: indexes
                .map((candidate, option) => ({
                option_index: option,
                candidate_index: candidate,
            }))
                .sort((a, b) => a.option_index === b.option_index
                ? a.candidate_index - b.candidate_index
                : a.option_index - b.option_index),
            quantity: (0, tstl_1.randint)(100, 1_000),
        })),
        ...(input ?? {}),
    };
};
exports.prepare_random_sale_unit = prepare_random_sale_unit;
const price = () => {
    const nominal = (0, tstl_1.randint)(15, 75) * 10000;
    const real = (nominal * (0, tstl_1.randint)(90, 100)) / 100;
    return { nominal, real };
};
//# sourceMappingURL=prepare_random_sale_unit.js.map