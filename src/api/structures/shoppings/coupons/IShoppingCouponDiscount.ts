import { tags } from "typia";

/**
 * Discount information of the coupon.
 *
 * `IShoppingCouponDiscount` is a type representing the discount information
 * of a {@link IShoppingCoupon}. Also, it is an union type that divided
 * by the {@link unit} of the discount value, `amount` or `percent`.
 *
 * @author Samchon
 */
export type IShoppingCouponDiscount =
  | IShoppingCouponDiscount.IAmount
  | IShoppingCouponDiscount.IPercent;
export namespace IShoppingCouponDiscount {
  /**
   * Discount information with amount unit.
   */
  export interface IAmount {
    /**
     * Discount unit as amount.
     *
     * It means the order price would be discounted by the amount value.
     */
    unit: "amount";

    /**
     * Discount value as amount.
     */
    value: number;

    /**
     * Minimum purchase amount for discount.
     *
     * When setting this value, discount coupons cannot be applied to
     * order totals that are less than this value.
     */
    threshold: null | (number & tags.Minimum<0>);

    /**
     * Maximum amount available for discount.
     *
     * When this value is set, no further discount will be given no
     * matter how much you order. This property would be meaningful
     * only when the {@link multiplicative} is `true`.
     */
    limit: null | (number & tags.ExclusiveMinimum<0>);

    /**
     * Multiplicative or not.
     *
     * If this property is `true`, the discount value would be multiplied
     * to the {@link IShoppingCartCommodity.volume} or
     * {@link IShoppingOrderGood.volume} value. Also, in that case,
     * the {@link limit} property would be meaningful.
     */
    multiplicative: boolean;
  }

  /**
   * Discount information with percent unit.
   */
  export interface IPercent {
    /**
     * Discount unit as percent.
     *
     * It means the order price would be discounted by the percent value.
     */
    unit: "percent";

    /**
     * Discount value as percent.
     */
    value: number & tags.Minimum<0> & tags.Maximum<100>;

    /**
     * Minimum purchase amount for discount.
     *
     * When setting this value, discount coupons cannot be applied to
     * order totals that are less than this value.
     */
    threshold: null | (number & tags.Minimum<0>);

    /**
     * Maximum amount available for discount.
     *
     * When this value is set, no further discount will be given no
     * matter how much you order.
     */
    limit: null | (number & tags.ExclusiveMinimum<0>);
  }
}
