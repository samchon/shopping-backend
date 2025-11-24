import { Prisma } from "@prisma/sdk";
import { IPointer } from "tstl";

import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingCouponFunnelCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponFunnelCriteria";

export namespace ShoppingCouponFunnelCriteriaProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      inputList: Prisma.shopping_coupon_funnel_criteriasGetPayload<
        ReturnType<typeof select>
      >[],
    ): IShoppingCouponFunnelCriteria.IFunnel[] =>
      inputList.map((input) =>
        input.kind === "variable"
          ? {
              kind: "variable",
              key: input.key!,
              value: input.value,
            }
          : {
              kind: input.kind as "url" | "referrer",
              value: input.value,
            },
      );
    export const select = () =>
      ({}) satisfies Prisma.shopping_coupon_funnel_criteriasFindManyArgs;
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const collect = (props: {
    counter: IPointer<number>;
    base: () => IShoppingCouponCriteria.ICollectBase;
    input: IShoppingCouponFunnelCriteria.ICreate;
  }) =>
    props.input.funnels.map((funnel) => ({
      ...props.base(),
      sequence: props.counter.value++,
      of_funnel: {
        create: {
          kind: funnel.kind,
          value: funnel.value,
          key: funnel.kind === "variable" ? funnel.key : null,
        },
      },
    })) satisfies Prisma.shopping_coupon_criteriasCreateWithoutCouponInput[];
}
