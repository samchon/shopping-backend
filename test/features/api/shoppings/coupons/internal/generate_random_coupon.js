"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_coupon = void 0;
const prepare_random_coupon_criteria_1 = require("./prepare_random_coupon_criteria");
const generate_random_coupon = async (props) => {
    const criterias = props.types.map((type) => (0, prepare_random_coupon_criteria_1.prepare_random_coupon_criteria)({
        ...props,
        type,
    }));
    return props.create(props.prepare(criterias));
};
exports.generate_random_coupon = generate_random_coupon;
//# sourceMappingURL=generate_random_coupon.js.map