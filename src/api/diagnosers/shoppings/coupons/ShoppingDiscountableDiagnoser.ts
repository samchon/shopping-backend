import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponCombination } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCombination";
import { IShoppingCouponTicket } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponTicket";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";

import { ShoppingCouponDiagnoser } from "./ShoppingCouponDiagnoser";

export namespace ShoppingDiscountableDiagnoser {
  export interface IAccessor<T> {
    item: (value: T) => IShoppingCartCommodity;
    volume: (value: T) => number;
  }

  /* -----------------------------------------------------------
    FILTERS
  ----------------------------------------------------------- */
  export const checkCoupon =
    <T extends IEntity>(accessor: IAccessor<T>) =>
    (customer: IShoppingCustomer) =>
    (data: T[]) =>
    (coupon: IShoppingCoupon): boolean =>
      filterItems(accessor)(customer)(coupon)(data).length !== 0;

  export const filterItems =
    <T extends IEntity>(accessor: IAccessor<T>) =>
    (customer: IShoppingCustomer) =>
    (coupon: IShoppingCoupon) =>
    (data: T[]) =>
      _Filter_criterias(accessor)(customer)(coupon)(data);

  const _Filter_criterias =
    <T extends IEntity>(accessor: IAccessor<T>) =>
    (customer: IShoppingCustomer) =>
    (coupon: IShoppingCoupon) =>
    (data: T[]) =>
      _Filter_threshold(accessor)(coupon)(
        data.filter((elem) =>
          ShoppingCouponDiagnoser.adjustable(customer)(
            accessor.item(elem).sale,
          )(coupon),
        ),
      );

  const _Filter_threshold =
    <T extends IEntity>(accessor: IAccessor<T>) =>
    (coupon: IShoppingCoupon) =>
    (data: T[]): T[] => {
      if (coupon.discount.threshold === null)
        return coupon.discount.unit === "amount" &&
          coupon.discount.multiplicative === true
          ? data.filter(
              (elem) => accessor.item(elem).price.real >= coupon.discount.value,
            )
          : data;
      else if (
        coupon.discount.unit === "amount" &&
        coupon.discount.multiplicative === true
      )
        return data.filter(
          (elem) =>
            accessor.item(elem).price.real >= coupon.discount.threshold! &&
            accessor.item(elem).price.real >= coupon.discount.value,
        );
      const sum: number = data
        .map((elem) => _Get_price(accessor)(elem))
        .reduce((x, y) => x + y, 0);
      return sum >= coupon.discount.threshold ? data : [];
    };

  const _Get_price =
    <T extends IEntity>(accessor: IAccessor<T>) =>
    (elem: T): number =>
      accessor.item(elem).price.real * accessor.volume(elem);

  /* -----------------------------------------------------------
    COMPUTATIONS
  ----------------------------------------------------------- */
  export interface IDiscount<T extends IEntity> {
    amount: number;

    /**
     * 1st key: coupon.id
     * 2nd key: item.id
     * value: amount
     */
    coupon_to_elem_dict: Map<string, Map<string, number>>;
  }
  export namespace IDiscount {
    export interface IElemToCoupon<Coupon extends IShoppingCoupon> {
      amount: number;
      coupons: Coupon[];
    }
  }

  export const discount =
    <T extends IEntity>(props: { className: string; accessor: IAccessor<T> }) =>
    (customer: IShoppingCustomer) =>
    (coupons: IShoppingCoupon[]) =>
    (data: T[]): IDiscount<T> =>
      _Discount({
        title: `${props.className}.discount`,
        accessor: props.accessor,
      })(customer)(coupons)(data);

  const _Discount =
    <T extends IEntity>(props: { title: string; accessor: IAccessor<T> }) =>
    (customer: IShoppingCustomer) =>
    <Coupon extends IShoppingCoupon>(couponList: Coupon[]) =>
    (data: T[]): IDiscount<T> => {
      // SORT COUPONS
      ShoppingCouponDiagnoser.sort(couponList);

      // CHECK POSSIBILITY
      if (false === ShoppingCouponDiagnoser.coexistable(couponList))
        throw new Error(
          `Error on ${props.title}(): target coupons are not coexistable.`,
        );

      // CONSTRUCT DISCOUNT DICTIONARY
      const output: IDiscount<T> = {
        amount: 0,
        coupon_to_elem_dict: new Map(),
      };

      // DO DISCOUNT
      for (const coupon of couponList) {
        const filtered: T[] = _Filter_criterias(props.accessor)(customer)(
          coupon,
        )(data);
        if (filtered.length !== 0)
          _Determine(props.accessor)(coupon)(data)(output);
      }
      return output;
    };

  const _Determine =
    <T extends IEntity>(accessor: IAccessor<T>) =>
    (coupon: IShoppingCoupon) =>
    (data: T[]) =>
    (output: IDiscount<T>) => {
      const adjust = (elem: T, value: number) => {
        take(output.coupon_to_elem_dict)(coupon.id)(
          () => new Map<string, number>(),
        ).set(elem.id, value);
      };
      if (coupon.discount.unit === "percent")
        for (const elem of data) {
          // DISCOUNTED VALUE
          const value: number =
            (coupon.discount.value / 100) * _Get_price(accessor)(elem);

          // ADJUST
          output.amount += value;
          adjust(elem, value);
        }
      else if (coupon.discount.multiplicative === true)
        for (const elem of data) {
          const value: number = coupon.discount.value * accessor.volume(elem);
          adjust(elem, value);
          output.amount += value;
        }
      else {
        const denominator: number = data
          .map((elem) => _Get_price(accessor)(elem))
          .reduce((x, y) => x + y, 0);
        for (const elem of data) {
          const value: number =
            ((coupon.discount.value / 100) * _Get_price(accessor)(elem)) /
            denominator;
          adjust(elem, value);
        }
        output.amount += coupon.discount.value;
      }
    };

  /* -----------------------------------------------------------
    COMBINATOR
  ----------------------------------------------------------- */
  export type ICombination = IShoppingCouponCombination<IEntry>;
  export interface IEntry extends IShoppingCouponCombination.IEntry {
    item_id: string;
  }

  export const combinate =
    <T extends IEntity>(props: { className: string; accessor: IAccessor<T> }) =>
    (customer: IShoppingCustomer) =>
    (coupons: IShoppingCoupon[], tickets: IShoppingCouponTicket[]) =>
    (data: T[]): ICombination[] => {
      // FILTER COUPONS
      const ticketMap: Map<string, IShoppingCouponTicket> = new Map(
        tickets.map((t) => [t.coupon.id, t]),
      );
      coupons = coupons.filter(
        (c) =>
          false === ticketMap.has(c.id) &&
          checkCoupon(props.accessor)(customer)(data)(c),
      );
      tickets = [...ticketMap.values()].filter((elem) =>
        checkCoupon(props.accessor)(customer)(data)(elem.coupon),
      );

      // CONSTRUCT COUPON MATRIX
      const entire: IShoppingCoupon[] = [
        ...coupons,
        ...tickets.map((t) => t.coupon),
      ];
      const matrix: IShoppingCoupon[][] = [
        entire.filter((c) => c.restriction.exclusive === false),
        ...entire
          .filter((c) => c.restriction.exclusive === true)
          .map((c) => [c]),
      ].filter((row) => row.length !== 0);

      // COMPUTE COMBINATIONS
      const combinations: IDiscount<T>[] = matrix.map((coupons) =>
        _Discount({
          title: `${props.className}.combinate`,
          accessor: props.accessor,
        })(customer)(coupons)(data),
      );
      return combinations.map((comb, i) => ({
        coupons: matrix[i].filter((x) => coupons.some((y) => x.id === y.id)),
        tickets: tickets.filter((t) =>
          matrix[i].some((c) => c.id === t.coupon.id),
        ),
        entries: [...comb.coupon_to_elem_dict.entries()]
          .map(([coupon_id, elements]) =>
            [...elements.entries()].map(([item_id, amount]) => ({
              coupon_id,
              item_id,
              amount,
            })),
          )
          .flat(),
        amount: comb.amount,
      }));
    };
}

const take =
  <Key, T>(dict: Map<Key, T>) =>
  (key: Key) =>
  (generator: () => T): T => {
    const oldbie: T | undefined = dict.get(key);
    if (oldbie) return oldbie;

    const value: T = generator();
    dict.set(key, value);
    return value;
  };
