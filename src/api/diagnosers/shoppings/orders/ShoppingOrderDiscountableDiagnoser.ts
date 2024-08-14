import { IShoppingCustomer } from "../../../structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCoupon } from "../../../structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponTicket } from "../../../structures/shoppings/coupons/IShoppingCouponTicket";
import { IShoppingOrderDiscountable } from "../../../structures/shoppings/orders/IShoppingOrderDiscountable";
import { IShoppingOrderGood } from "../../../structures/shoppings/orders/IShoppingOrderGood";

import { ShoppingDiscountableDiagnoser } from "../coupons/ShoppingDiscountableDiagnoser";

export namespace ShoppingOrderDiscountableDiagnoser {
  export const checkCoupon =
    (customer: IShoppingCustomer) =>
    (goods: IShoppingOrderGood[]) =>
    (coupon: IShoppingCoupon): boolean =>
      ShoppingDiscountableDiagnoser.checkCoupon(accessor)(customer)(goods)(
        coupon,
      );

  export const filterGoods =
    (customer: IShoppingCustomer) =>
    (coupon: IShoppingCoupon) =>
    (goods: IShoppingOrderGood[]): IShoppingOrderGood[] =>
      ShoppingDiscountableDiagnoser.filterItems(accessor)(customer)(coupon)(
        goods,
      );

  export const combinate =
    (customer: IShoppingCustomer) =>
    (coupons: IShoppingCoupon[], tickets: IShoppingCouponTicket[]) =>
    (goods: IShoppingOrderGood[]): IShoppingOrderDiscountable.ICombination[] =>
      ShoppingDiscountableDiagnoser.combinate({
        className: "ShoppingOrderDiscountableDiagnoser",
        accessor,
      })(customer)(
        coupons,
        tickets,
      )(goods).map((comb) => ({
        ...comb,
        entries: comb.entries.map((entry) => ({
          coupon_id: entry.coupon_id,
          good_id: entry.item_id,
          amount: entry.amount,
        })),
      }));

  export const discount =
    (customer: IShoppingCustomer) =>
    (coupons: IShoppingCoupon[]) =>
    (
      goods: IShoppingOrderGood[],
    ): ShoppingDiscountableDiagnoser.IDiscount<IShoppingOrderGood> =>
      ShoppingDiscountableDiagnoser.discount({
        className: "ShoppingOrderDiscountableDiagnoser",
        accessor,
      })(customer)(coupons)(goods);
}

const accessor: ShoppingDiscountableDiagnoser.IAccessor<IShoppingOrderGood> = {
  item: (good) => good.commodity,
  volume: (good) => good.volume,
};
