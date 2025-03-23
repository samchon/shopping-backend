import { tags } from "typia";

/**
 * Restriction information of the coupon.
 *
 * @author Samchon
 */
export interface IShoppingCouponRestriction {
  /**
   * Access level of coupon.
   *
   * - public: possible to find from public API
   * - private: unable to find from public API
   *   - arbitrarily assigned by the seller or administrator
   *   - issued from one-time link
   */
  access: "public" | "private";

  /**
   * Exclusivity or not.
   *
   * An exclusive discount coupon refers to a discount coupon that has an
   * exclusive relationship with other discount coupons and can only be
   * used alone. That is, when an exclusive discount coupon is used, no
   * other discount coupon can be used for the same
   * {@link IShoppingOrder order} or {@link IShoppingOrderGood good}.
   *
   * Please note that this exclusive attribute is a very different concept
   * from multiplicative, which means whether the same coupon can be
   * multiplied and applied to multiple coupons of the same order, so
   * please do not confuse them.
   */
  exclusive: boolean;

  /**
   * Limited quantity issued.
   *
   * If there is a limit to the quantity issued, it becomes impossible
   * to issue tickets exceeding this value.
   *
   * In other words, the concept of N coupons being issued on
   * a first-come, first-served basis is created.
   */
  volume: null | (number & tags.Type<"uint32">);

  /**
   * Limited quantity issued per person.
   *
   * As a limit to the total amount of issuance per person, it is
   * common to assign 1 to limit duplicate issuance to the same citizen,
   * or to use the NULL value to set no limit.
   *
   * Of course, by assigning a value of N, the total amount issued
   * to the same citizen can be limited.
   */
  volume_per_citizen: null | (number & tags.Type<"uint32">);

  /**
   * Expiration day(s) value.
   *
   * The concept of expiring N days after a discount coupon ticket is issued.
   *
   * Therefore, customers must use the ticket within N days, if possible,
   * from the time it is issued.
   */
  expired_in: null | (number & tags.Type<"uint32">);

  /**
   * Expiration date.
   *
   * A concept that expires after YYYY-MM-DD after a discount coupon ticket
   * is issued.
   *
   * Double restrictions are possible with expired_in, of which the one
   * with the shorter expiration date is used.
   */
  expired_at: null | (string & tags.Format<"date-time">);
}
