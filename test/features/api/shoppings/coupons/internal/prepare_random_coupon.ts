import { RandomGenerator } from "@nestia/e2e";

import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingCouponDiscount } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponDiscount";
import { IShoppingCouponRestriction } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponRestriction";

export const prepare_random_coupon = (
  input?: Partial<Omit<IShoppingCoupon.ICreate, "discount" | "restriction">> &
    Partial<{
      discount: Partial<IShoppingCouponDiscount>;
      restriction: Partial<IShoppingCouponRestriction>;
    }>,
): IShoppingCoupon.ICreate => ({
  name: input?.name ?? RandomGenerator.name(16),
  opened_at: input?.opened_at ?? new Date().toISOString(),
  closed_at: input?.closed_at ?? null,
  criterias: input?.criterias ?? ([] as IShoppingCouponCriteria.ICreate[]),
  disposable_codes: input?.disposable_codes ?? [],
  discount:
    input?.discount?.unit !== undefined
      ? input.discount.unit === "amount"
        ? ({
            unit: "amount",
            value: 5_000,
            threshold: null,
            limit: null,
            multiplicative: false,
            ...((input.discount ??
              {}) as Partial<IShoppingCouponDiscount.IAmount>),
          } satisfies IShoppingCouponDiscount.IAmount)
        : ({
            unit: "percent",
            value: 10,
            threshold: null,
            limit: null,
            ...((input.discount ??
              {}) as Partial<IShoppingCouponDiscount.IPercent>),
          } satisfies IShoppingCouponDiscount.IPercent)
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
