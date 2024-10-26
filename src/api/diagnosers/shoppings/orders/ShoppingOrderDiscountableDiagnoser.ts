import { IShoppingCustomer } from "../../../structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCoupon } from "../../../structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponTicket } from "../../../structures/shoppings/coupons/IShoppingCouponTicket";
import { IShoppingOrderDiscountable } from "../../../structures/shoppings/orders/IShoppingOrderDiscountable";
import { IShoppingOrderGood } from "../../../structures/shoppings/orders/IShoppingOrderGood";

import { ShoppingDiscountableDiagnoser } from "../coupons/ShoppingDiscountableDiagnoser";

export namespace ShoppingOrderDiscountableDiagnoser {
  export const checkCoupon = (props: {
    customer: IShoppingCustomer;
    goods: IShoppingOrderGood[];
    coupon: IShoppingCoupon;
  }): boolean =>
    ShoppingDiscountableDiagnoser.checkCoupon({
      accessor,
      customer: props.customer,
      coupon: props.coupon,
      data: props.goods,
    });

  export const filterGoods = (props: {
    customer: IShoppingCustomer;
    coupon: IShoppingCoupon;
    goods: IShoppingOrderGood[];
  }): IShoppingOrderGood[] =>
    ShoppingDiscountableDiagnoser.filterItems({
      accessor,
      customer: props.customer,
      coupon: props.coupon,
      data: props.goods,
    });

  export const combinate = (props: {
    customer: IShoppingCustomer;
    coupons: IShoppingCoupon[];
    tickets: IShoppingCouponTicket[];
    goods: IShoppingOrderGood[];
  }): IShoppingOrderDiscountable.ICombination[] =>
    ShoppingDiscountableDiagnoser.combinate<any>({
      className: "ShoppingOrderDiscountableDiagnoser",
      accessor,
      customer: props.customer,
      coupons: props.coupons,
      tickets: props.tickets,
      data: props.goods,
    }).map((comb) => ({
      ...comb,
      entries: comb.entries.map((entry) => ({
        coupon_id: entry.coupon_id,
        good_id: entry.item_id,
        amount: entry.amount,
      })),
    }));

  export const discount = (props: {
    customer: IShoppingCustomer;
    coupons: IShoppingCoupon[];
    goods: IShoppingOrderGood[];
  }): ShoppingDiscountableDiagnoser.IDiscount<IShoppingOrderGood> =>
    ShoppingDiscountableDiagnoser.discount({
      className: "ShoppingOrderDiscountableDiagnoser",
      accessor,
      customer: props.customer,
      coupons: props.coupons,
      data: props.goods,
    });
}

const accessor: ShoppingDiscountableDiagnoser.IAccessor<IShoppingOrderGood> = {
  item: (good) => good.commodity,
  volume: (good) => good.volume,
};
