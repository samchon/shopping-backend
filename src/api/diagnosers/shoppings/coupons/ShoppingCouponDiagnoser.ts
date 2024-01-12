import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingSaleSnapshot } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleSnapshot";

import { ShoppingCouponCriteriaDiagnoser } from "./ShoppingCouponCriteriaDianoser";

export namespace ShoppingCouponDiagnoser {
  export const adjustable =
    (customer: IShoppingCustomer) =>
    (sale: IShoppingSaleSnapshot.IInvert) =>
    (coupon: IShoppingCoupon): boolean =>
      coupon.criterias.every(
        ShoppingCouponCriteriaDiagnoser.adjustable(customer)(sale),
      );

  export const coexistable = (coupons: IShoppingCoupon[]): boolean =>
    coupons.length <= 1 ||
    coupons.every((c) => c.restriction.exclusive === false);

  export const sort = <T extends IShoppingCoupon>(coupons: T[]): T[] =>
    coupons.sort(compare);

  function compare(x: IShoppingCoupon, y: IShoppingCoupon): number {
    if (x.discount.unit !== y.discount.unit)
      return x.discount.unit === "percent" ? -1 : 1;
    else if (x.discount.unit === "amount" && y.discount.unit === "amount")
      return Number(x.discount.value) - Number(y.discount.value);
    else return y.discount.value - x.discount.value;
  }
}