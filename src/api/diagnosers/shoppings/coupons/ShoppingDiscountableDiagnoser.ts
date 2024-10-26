import { IEntity } from "../../../structures/common/IEntity";
import { IShoppingCustomer } from "../../../structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCoupon } from "../../../structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponCombination } from "../../../structures/shoppings/coupons/IShoppingCouponCombination";
import { IShoppingCouponTicket } from "../../../structures/shoppings/coupons/IShoppingCouponTicket";
import { IShoppingCartCommodity } from "../../../structures/shoppings/orders/IShoppingCartCommodity";

import { ShoppingCouponDiagnoser } from "./ShoppingCouponDiagnoser";

export namespace ShoppingDiscountableDiagnoser {
  export interface IAccessor<T> {
    item: (value: T) => IShoppingCartCommodity;
    volume: (value: T) => number;
  }

  /* -----------------------------------------------------------
    FILTERS
  ----------------------------------------------------------- */
  export const checkCoupon = <T extends IEntity>(props: {
    accessor: IAccessor<T>;
    customer: IShoppingCustomer;
    coupon: IShoppingCoupon;
    data: T[];
  }): boolean => filterItems(props).length !== 0;

  export const filterItems = <T extends IEntity>(props: {
    accessor: IAccessor<T>;
    customer: IShoppingCustomer;
    coupon: IShoppingCoupon;
    data: T[];
  }): T[] => _Filter_criterias(props);

  const _Filter_criterias = <T extends IEntity>(props: {
    accessor: IAccessor<T>;
    customer: IShoppingCustomer;
    coupon: IShoppingCoupon;
    data: T[];
  }): T[] =>
    _Filter_threshold({
      accessor: props.accessor,
      coupon: props.coupon,
      data: props.data.filter((elem) =>
        ShoppingCouponDiagnoser.adjustable({
          customer: props.customer,
          sale: props.accessor.item(elem).sale,
          coupon: props.coupon,
        })
      ),
    });

  const _Filter_threshold = <T extends IEntity>(props: {
    accessor: IAccessor<T>;
    coupon: IShoppingCoupon;
    data: T[];
  }): T[] => {
    if (props.coupon.discount.threshold === null)
      return props.coupon.discount.unit === "amount" &&
        props.coupon.discount.multiplicative === true
        ? props.data.filter(
            (elem) =>
              props.accessor.item(elem).price.real >=
              props.coupon.discount.value
          )
        : props.data;
    else if (
      props.coupon.discount.unit === "amount" &&
      props.coupon.discount.multiplicative === true
    )
      return props.data.filter(
        (elem) =>
          props.accessor.item(elem).price.real >=
            props.coupon.discount.threshold! &&
          props.accessor.item(elem).price.real >= props.coupon.discount.value
      );
    const sum: number = props.data
      .map((elem) => _Get_price(props.accessor)(elem))
      .reduce((x, y) => x + y, 0);
    return sum >= props.coupon.discount.threshold ? props.data : [];
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

  export const discount = <T extends IEntity>(props: {
    className: string;
    accessor: IAccessor<T>;
    customer: IShoppingCustomer;
    coupons: IShoppingCoupon[];
    data: T[];
  }): IDiscount<T> =>
    _Discount({
      ...props,
      title: `${props.className}.discount`,
    });

  const _Discount = <T extends IEntity, Coupon extends IShoppingCoupon>(props: {
    title: string;
    accessor: IAccessor<T>;
    customer: IShoppingCustomer;
    coupons: Coupon[];
    data: T[];
  }): IDiscount<T> => {
    // SORT COUPONS
    ShoppingCouponDiagnoser.sort(props.coupons);

    // CHECK POSSIBILITY
    if (false === ShoppingCouponDiagnoser.coexistable(props.coupons))
      throw new Error(
        `Error on ${props.title}(): target coupons are not coexistable.`
      );

    // CONSTRUCT DISCOUNT DICTIONARY
    const output: IDiscount<T> = {
      amount: 0,
      coupon_to_elem_dict: new Map(),
    };

    // DO DISCOUNT
    for (const coupon of props.coupons) {
      const filtered: T[] = _Filter_criterias({
        accessor: props.accessor,
        customer: props.customer,
        data: props.data,
        coupon,
      });
      if (filtered.length !== 0)
        _Determine({
          accessor: props.accessor,
          coupon,
          data: props.data,
          output,
        });
    }
    return output;
  };

  const _Determine = <T extends IEntity>(props: {
    accessor: IAccessor<T>;
    coupon: IShoppingCoupon;
    data: T[];
    output: IDiscount<T>;
  }) => {
    const adjust = (elem: T, value: number) => {
      take(
        props.output.coupon_to_elem_dict,
        props.coupon.id,
        () => new Map<string, number>()
      ).set(elem.id, value);
    };
    if (props.coupon.discount.unit === "percent")
      for (const elem of props.data) {
        // DISCOUNTED VALUE
        const value: number =
          (props.coupon.discount.value / 100) *
          _Get_price(props.accessor)(elem);

        // ADJUST
        props.output.amount += value;
        adjust(elem, value);
      }
    else if (props.coupon.discount.multiplicative === true)
      for (const elem of props.data) {
        const value: number =
          props.coupon.discount.value * props.accessor.volume(elem);
        adjust(elem, value);
        props.output.amount += value;
      }
    else {
      const denominator: number = props.data
        .map((elem) => _Get_price(props.accessor)(elem))
        .reduce((x, y) => x + y, 0);
      for (const elem of props.data) {
        const value: number =
          ((props.coupon.discount.value / 100) *
            _Get_price(props.accessor)(elem)) /
          denominator;
        adjust(elem, value);
      }
      props.output.amount += props.coupon.discount.value;
    }
  };

  /* -----------------------------------------------------------
    COMBINATOR
  ----------------------------------------------------------- */
  export type ICombination = IShoppingCouponCombination<IEntry>;
  export interface IEntry extends IShoppingCouponCombination.IEntry {
    item_id: string;
  }

  export const combinate = <T extends IEntity>(props: {
    className: string;
    accessor: IAccessor<T>;
    customer: IShoppingCustomer;
    coupons: IShoppingCoupon[];
    tickets: IShoppingCouponTicket[];
    data: T[];
  }): ICombination[] => {
    // FILTER COUPONS
    const ticketMap: Map<string, IShoppingCouponTicket> = new Map(
      props.tickets.map((t) => [t.coupon.id, t])
    );
    const coupons = props.coupons.filter(
      (c) =>
        false === ticketMap.has(c.id) &&
        checkCoupon({
          accessor: props.accessor,
          customer: props.customer,
          data: props.data,
          coupon: c,
        })
    );
    const tickets = [...ticketMap.values()].filter((elem) =>
      checkCoupon({
        accessor: props.accessor,
        customer: props.customer,
        data: props.data,
        coupon: elem.coupon,
      })
    );

    // CONSTRUCT COUPON MATRIX
    const entire: IShoppingCoupon[] = [
      ...coupons,
      ...tickets.map((t) => t.coupon),
    ];
    const matrix: IShoppingCoupon[][] = [
      entire.filter((c) => c.restriction.exclusive === false),
      ...entire.filter((c) => c.restriction.exclusive === true).map((c) => [c]),
    ].filter((row) => row.length !== 0);

    // COMPUTE COMBINATIONS
    const combinations: IDiscount<T>[] = matrix.map((coupons) =>
      _Discount({
        title: `${props.className}.combinate`,
        accessor: props.accessor,
        customer: props.customer,
        data: props.data,
        coupons,
      })
    );
    return combinations.map((comb, i) => ({
      coupons: matrix[i].filter((x) => coupons.some((y) => x.id === y.id)),
      tickets: tickets.filter((t) =>
        matrix[i].some((c) => c.id === t.coupon.id)
      ),
      entries: [...comb.coupon_to_elem_dict.entries()]
        .map(([coupon_id, elements]) =>
          [...elements.entries()].map(([item_id, amount]) => ({
            coupon_id,
            item_id,
            amount,
          }))
        )
        .flat(),
      amount: comb.amount,
    }));
  };
}

const take = <Key, T>(dict: Map<Key, T>, key: Key, generator: () => T): T => {
  const oldbie: T | undefined = dict.get(key);
  if (oldbie) return oldbie;

  const value: T = generator();
  dict.set(key, value);
  return value;
};
