import { IShoppingCustomer } from "../../../structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCoupon } from "../../../structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponTicket } from "../../../structures/shoppings/coupons/IShoppingCouponTicket";
import { IShoppingCartCommodity } from "../../../structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingCartDiscountable } from "../../../structures/shoppings/orders/IShoppingCartDiscountable";

import { ShoppingDiscountableDiagnoser } from "../coupons/ShoppingDiscountableDiagnoser";

export namespace ShoppingCartDiscountableDiagnoser {
  export const checkCoupon =
    (customer: IShoppingCustomer) =>
    (commodities: IShoppingCartCommodity[]) =>
    (coupon: IShoppingCoupon) =>
      ShoppingDiscountableDiagnoser.checkCoupon(accessor)(customer)(
        commodities
      )(coupon);

  export const filterCommodities =
    (customer: IShoppingCustomer) =>
    (coupon: IShoppingCoupon) =>
    (commodities: IShoppingCartCommodity[]) =>
      ShoppingDiscountableDiagnoser.filterItems(accessor)(customer)(coupon)(
        commodities
      );

  export const combinate =
    (customer: IShoppingCustomer) =>
    (coupons: IShoppingCoupon[], tickets: IShoppingCouponTicket[]) =>
    (
      commodities: IShoppingCartCommodity[]
    ): IShoppingCartDiscountable.ICombination[] =>
      ShoppingDiscountableDiagnoser.combinate({
        className: "ShoppingCartDiscountableDiagnoser",
        accessor,
      })(customer)(
        coupons,
        tickets
      )(commodities).map((comb) => ({
        ...comb,
        entries: comb.entries.map((entry) => ({
          coupon_id: entry.coupon_id,
          commodity_id: entry.item_id,
          amount: entry.amount,
          pseudo: !!commodities.find((c) => c.id === entry.item_id)?.pseudo,
        })),
      }));
}

const accessor: ShoppingDiscountableDiagnoser.IAccessor<IShoppingCartCommodity> =
  {
    item: (commodity) => commodity,
    volume: (commodity) => commodity.volume,
  };
