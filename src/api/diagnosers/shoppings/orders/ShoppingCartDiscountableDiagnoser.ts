import { IShoppingCustomer } from "../../../structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCoupon } from "../../../structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponTicket } from "../../../structures/shoppings/coupons/IShoppingCouponTicket";
import { IShoppingCartCommodity } from "../../../structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingCartDiscountable } from "../../../structures/shoppings/orders/IShoppingCartDiscountable";
import { ShoppingDiscountableDiagnoser } from "../coupons/ShoppingDiscountableDiagnoser";

export namespace ShoppingCartDiscountableDiagnoser {
  export const checkCoupon = (props: {
    customer: IShoppingCustomer;
    commodities: IShoppingCartCommodity[];
    coupon: IShoppingCoupon;
  }): boolean =>
    ShoppingDiscountableDiagnoser.checkCoupon({
      accessor,
      customer: props.customer,
      coupon: props.coupon,
      data: props.commodities,
    });

  export const filterCommodities = (props: {
    customer: IShoppingCustomer;
    coupon: IShoppingCoupon;
    commodities: IShoppingCartCommodity[];
  }) =>
    ShoppingDiscountableDiagnoser.filterItems({
      accessor,
      customer: props.customer,
      coupon: props.coupon,
      data: props.commodities,
    });

  export const combine = (props: {
    customer: IShoppingCustomer;
    coupons: IShoppingCoupon[];
    tickets: IShoppingCouponTicket[];
    commodities: IShoppingCartCommodity[];
  }): IShoppingCartDiscountable.ICombination[] => {
    return ShoppingDiscountableDiagnoser.combine({
      className: "ShoppingCartDiscountableDiagnoser",
      accessor,
      customer: props.customer,
      coupons: props.coupons,
      tickets: props.tickets,
      data: props.commodities,
    }).map((comb) => ({
      ...comb,
      entries: comb.entries.map((entry) => ({
        coupon_id: entry.coupon_id,
        commodity_id: entry.item_id,
        amount: entry.amount,
        pseudo: !!props.commodities.find((c) => c.id === entry.item_id)?.pseudo,
      })),
    }));
  };
}

const accessor: ShoppingDiscountableDiagnoser.IAccessor<IShoppingCartCommodity> =
  {
    item: (commodity) => commodity,
    volume: (commodity) => commodity.volume,
  };
