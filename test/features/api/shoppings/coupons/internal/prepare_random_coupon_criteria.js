"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare_random_coupon_criteria = void 0;
const TestGlobal_1 = require("../../../../../TestGlobal");
const prepare_random_coupon_criteria = (props) => props.type === "funnel"
    ? {
        type: props.type,
        direction: props.direction,
        funnels: funnels(props.customer ?? null),
    }
    : props.type === "sale"
        ? {
            type: props.type,
            direction: props.direction,
            sale_ids: [props.sale.id],
        }
        : props.type === "section"
            ? {
                type: props.type,
                direction: props.direction,
                section_codes: [props.sale.section.code],
            }
            : {
                type: props.type,
                direction: props.direction,
                seller_ids: [props.sale.seller.id],
            };
exports.prepare_random_coupon_criteria = prepare_random_coupon_criteria;
const funnels = (customer) => {
    const params = (() => {
        if (customer === null)
            return new URLSearchParams();
        const index = customer.href.indexOf("?");
        if (index === -1)
            return new URLSearchParams();
        return new URLSearchParams(customer.href.substring(index + 1));
    })();
    return [
        {
            kind: "url",
            value: customer?.href ?? TestGlobal_1.TestGlobal.HREF,
        },
        {
            kind: "referrer",
            value: customer?.referrer ?? TestGlobal_1.TestGlobal.REFERRER,
        },
        ...[...params.entries()].map(([key, value]) => ({
            kind: "variable",
            key,
            value,
        })),
    ];
};
//# sourceMappingURL=prepare_random_coupon_criteria.js.map