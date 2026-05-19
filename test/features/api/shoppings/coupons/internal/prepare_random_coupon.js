"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare_random_coupon = void 0;
const e2e_1 = require("@nestia/e2e");
const prepare_random_coupon = (input) => ({
    name: input?.name ?? e2e_1.RandomGenerator.name(16),
    opened_at: input?.opened_at ?? new Date().toISOString(),
    closed_at: input?.closed_at ?? null,
    criterias: input?.criterias ?? [],
    disposable_codes: input?.disposable_codes ?? [],
    discount: input?.discount?.unit !== undefined
        ? input.discount.unit === "amount"
            ? {
                unit: "amount",
                value: 5_000,
                threshold: null,
                limit: null,
                multiplicative: false,
                ...(input.discount ??
                    {}),
            }
            : {
                unit: "percent",
                value: 10,
                threshold: null,
                limit: null,
                ...(input.discount ??
                    {}),
            }
        : {
            unit: "amount",
            value: 5_000,
            threshold: null,
            limit: null,
            multiplicative: false,
        },
    restriction: {
        access: "public",
        volume: 10_000,
        volume_per_citizen: 1,
        exclusive: false,
        expired_in: 15,
        expired_at: null,
        ...(input?.restriction ?? {}),
    },
});
exports.prepare_random_coupon = prepare_random_coupon;
//# sourceMappingURL=prepare_random_coupon.js.map