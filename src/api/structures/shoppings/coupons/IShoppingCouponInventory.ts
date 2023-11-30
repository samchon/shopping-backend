import { tags } from "typia";

/**
 * Inventory information of the coupon.
 *
 * If a {@link IShoppingCoupon coupon} has been designed with limited
 * inventory, this `IShoppingCouponInventory` structure represents the
 * remaining inventory information.
 *
 * @author Samchon
 */
export interface IShoppingCouponInventory {
  /**
   * Remaining volume for everyone.
   *
   * If there is a limit to the quantity issued, it becomes impossible to
   * issue tickets exceeding this value.
   *
   * In other words, the concept of N coupons being issued on a first-come,
   * first-served basis is created.
   */
  volume: null | (number & tags.Type<"uint32">);

  /**
   * Remaining volume per citizen.
   *
   * As a limit to the total amount of issuance per person, it is common to
   * assign 1 to limit duplicate issuance to the same citizen, or to use the
   * `nul`` value to set no limit.
   *
   * Of course, by assigning a value of N, the total amount issued to the
   * same citizen can be limited.
   */
  volume_per_citizen: null | (number & tags.Type<"uint32">);
}
