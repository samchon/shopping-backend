import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingCouponFunnelCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponFunnelCriteria";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { TestGlobal } from "../../../../../TestGlobal";

export const prepare_random_coupon_criteria = (
  props: prepare_random_coupon_criteria.IProps,
): IShoppingCouponCriteria.ICreate =>
  props.type === "channel"
    ? {
        type: props.type,
        direction: props.direction,
        channels: [
          {
            channel_code: props.sale.channels[0].code,
            category_ids: null,
          },
        ],
      }
    : props.type === "funnel"
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
export namespace prepare_random_coupon_criteria {
  export interface IProps {
    customer: IShoppingCustomer | null;
    type: IShoppingCouponCriteria.Type;
    direction: "include" | "exclude";
    sale: IShoppingSale;
  }
}

const funnels = (
  customer: IShoppingCustomer | null,
): IShoppingCouponFunnelCriteria.IFunnel[] => {
  const params: URLSearchParams = (() => {
    if (customer === null) return new URLSearchParams();
    const index: number = customer.href.indexOf("?");
    if (index === -1) return new URLSearchParams();
    return new URLSearchParams(customer.href.substring(index + 1));
  })();
  return [
    {
      kind: "url",
      value: customer?.href ?? TestGlobal.HREF,
    },
    {
      kind: "referrer",
      value: customer?.referrer ?? TestGlobal.REFERRER,
    },
    ...[...params.entries()].map(([key, value]) => ({
      kind: "variable" as const,
      key,
      value,
    })),
  ];
};
