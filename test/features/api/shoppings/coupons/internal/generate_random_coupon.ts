import typia from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { prepare_random_coupon_criteria } from "./prepare_random_coupon_criteria";

export const generate_random_coupon = async (
  props: generate_random_coupon.IProps,
): Promise<IShoppingCoupon> => {
  const criterias: IShoppingCouponCriteria.ICreate[] = props.types.map((type) =>
    prepare_random_coupon_criteria({
      ...props,
      type,
    }),
  );
  const coupon: IShoppingCoupon = await props.create({
    ...props.prepare(criterias),
    name: "Coupon",
  });
  return typia.assertEquals(coupon);
};
export namespace generate_random_coupon {
  export interface IProps {
    types: IShoppingCouponCriteria.Type[];
    direction: "include" | "exclude";
    customer: IShoppingCustomer | null;
    sale: IShoppingSale;
    create: (input: IShoppingCoupon.ICreate) => Promise<IShoppingCoupon>;
    prepare: (
      criterias: IShoppingCouponCriteria.ICreate[],
    ) => IShoppingCoupon.ICreate;
  }
}
