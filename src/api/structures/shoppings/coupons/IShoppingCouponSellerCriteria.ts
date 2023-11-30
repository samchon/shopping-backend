import { tags } from "typia";

import { IShoppingSeller } from "../actors/IShoppingSeller";
import { IShoppingCouponCriteriaBase } from "./IShoppingCouponCriteriaBase";

/**
 * Conditions for sellers of discount coupons.
 *
 * `IShoppingCouponSellerCriteria` is a subtype entity of
 * {@link IShoppingCouponCriteriaBase} and is used when setting conditions
 * for a specific {@link IShoppingSeller seller}.
 *
 * If the {@link direction} value is "include", the coupon can only be used
 * for the target {@link sellers}. Conversely, if it is "exclude", the
 * coupon cannot be used.
 *
 * @author Samchon
 */
export interface IShoppingCouponSellerCriteria
  extends IShoppingCouponCriteriaBase<"seller"> {
  /**
   * Target sellers to include or exclude.
   */
  sellers: IShoppingSeller[] & tags.MinItems<1>;
}
export namespace IShoppingCouponSellerCriteria {
  /**
   * Creation information of the seller criteria.
   */
  export interface ICreate
    extends IShoppingCouponCriteriaBase.ICreate<"seller"> {
    /**
     * List of target seller's {@link IShoppingSeller.id}s.
     */
    seller_ids: Array<string & tags.Format<"uuid">> & tags.MinItems<1>;
  }
}
