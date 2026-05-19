"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare_random_address = void 0;
const prepare_random_address = (citizen, input) => ({
    mobile: citizen.mobile,
    name: citizen.name,
    country: "Korea",
    province: "Seoul",
    city: "Seoul",
    department: "Seocho-gu Seocho-dong X-Apartment",
    possession: "1-101",
    zip_code: "12345",
    special_note: null,
    ...input,
});
exports.prepare_random_address = prepare_random_address;
//# sourceMappingURL=prepare_random_address.js.map