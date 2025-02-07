import { IShoppingCustomer } from "../../../structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCouponCriteria } from "../../../structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingSaleSnapshot } from "../../../structures/shoppings/sales/IShoppingSaleSnapshot";
import { IShoppingChannelCategory } from "../../../structures/shoppings/systematic/IShoppingChannelCategory";

export namespace ShoppingCouponCriteriaDiagnoser {
  export const adjustable = (props: {
    customer: IShoppingCustomer;
    sale: IShoppingSaleSnapshot.IInvert;
    criteria: IShoppingCouponCriteria;
  }) => {
    const res: boolean = include(props);
    return props.criteria.direction === "include" ? res : !res;
  };

  const include = (props: {
    customer: IShoppingCustomer;
    sale: IShoppingSaleSnapshot.IInvert;
    criteria: IShoppingCouponCriteria;
  }): boolean => {
    if (props.criteria.type === "section")
      return props.criteria.sections.some(
        (section) => section.id === props.sale.section.id,
      );
    else if (props.criteria.type === "seller")
      return props.criteria.sellers.some(
        (seller) => seller.id === props.sale.seller.id,
      );
    else if (props.criteria.type === "sale")
      return props.criteria.sales.some((s) => s.id === props.sale.id);
    else if (props.criteria.type === "funnel")
      return props.criteria.funnels.some((funnel) => {
        if (funnel.kind === "url")
          return props.customer.href.startsWith(funnel.value);
        else if (funnel.kind === "referrer")
          return (
            props.customer.referrer !== null &&
            props.customer.referrer.startsWith(funnel.value)
          );
        else if (funnel.kind === "variable") {
          const question: number = props.customer.href.lastIndexOf("?");
          if (question === -1) return false;

          const params: URLSearchParams = new URLSearchParams(
            props.customer.href.substring(question + 1),
          );
          return params.get(funnel.key) === funnel.value;
        }
        return false;
      });
    return false;
  };

  const explore =
    (target: IShoppingChannelCategory.IInvert) =>
    (current: IShoppingChannelCategory.IInvert): boolean =>
      target.id === current.id ||
      (current.parent !== null && explore(target)(current.parent));
}
