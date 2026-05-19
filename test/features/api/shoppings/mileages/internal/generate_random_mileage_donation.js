"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_mileage_donation = void 0;
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const generate_random_mileage_donation = async (pool, citizen, input) => {
    const donation = await index_1.default.functional.shoppings.admins.mileages.donations.create(pool.admin, {
        value: 10_000,
        reason: "test",
        citizen_id: citizen.id,
        ...input,
    });
    return donation;
};
exports.generate_random_mileage_donation = generate_random_mileage_donation;
//# sourceMappingURL=generate_random_mileage_donation.js.map