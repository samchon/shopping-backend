import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCouponChannelCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponChannelCriteria";
import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingSaleChannel } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleChannel";
import { IShoppingSaleSnapshot } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleSnapshot";
import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

export namespace ShoppingCouponCriteriaDiagnoser {
  export const adjustable =
    (customer: IShoppingCustomer) =>
    (sale: IShoppingSaleSnapshot.IInvert) =>
    (criteria: IShoppingCouponCriteria) => {
      const res: boolean = include(customer)(sale)(criteria);
      return criteria.direction === "include" ? res : !res;
    };

  const include =
    (customer: IShoppingCustomer) =>
    (sale: IShoppingSaleSnapshot.IInvert) =>
    (criteria: IShoppingCouponCriteria) => {
      if (criteria.type === "channel")
        return (
          criteria.channels.some((t) => t.channel.id === customer.channel.id) &&
          criteria.channels.some((tuple) => belongs(sale)(tuple))
        );
      else if (criteria.type === "section")
        return criteria.sections.some(
          (section) => section.id === sale.section.id,
        );
      else if (criteria.type === "seller")
        return criteria.sellers.some((seller) => seller.id === sale.seller.id);
      else if (criteria.type === "sale")
        return criteria.sales.some((s) => s.id === sale.id);
      else if (criteria.type === "funnel")
        return criteria.funnels.some((funnel) => {
          if (funnel.kind === "url")
            return customer.href.startsWith(funnel.value);
          else if (funnel.kind === "referrer")
            return customer.referrer.startsWith(funnel.value);
          else if (funnel.kind === "variable") {
            const question: number = customer.href.lastIndexOf("?");
            if (question === -1) return false;

            const params: URLSearchParams = new URLSearchParams(
              customer.href.substring(question + 1),
            );
            return params.get(funnel.key) === funnel.value;
          }
          return false;
        });
      return false;
    };

  const belongs =
    (sale: IShoppingSaleSnapshot.IInvert) =>
    (tuple: IShoppingCouponChannelCriteria.IChannelTo) => {
      const matched: IShoppingSaleChannel | undefined = sale.channels.find(
        (ch) => ch.id === tuple.channel.id,
      );
      if (matched === undefined) return false;
      else if (!tuple.categories?.length) return true;

      return tuple.categories.some((target) =>
        matched.categories.some((current) => explore(target)(current)),
      );
    };

  const explore =
    (target: IShoppingChannelCategory.IInvert) =>
    (current: IShoppingChannelCategory.IInvert): boolean =>
      target.id === current.id ||
      (current.parent !== null && explore(target)(current.parent));
}
