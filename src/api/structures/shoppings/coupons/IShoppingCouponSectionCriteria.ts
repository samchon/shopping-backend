import { tags } from "typia";

import { IShoppingSection } from "../systematic/IShoppingSection";
import { IShoppingCouponCriteriaBase } from "./IShoppingCouponCriteriaBase";

/**
 * Conditions for sections of discount coupons.
 *
 * `IShoppingCouponSectionCriteria` is a subtype entity of
 * {@link IShoppingCouponCriteriaBase} and is used when setting conditions
 * for a specific {@link IShoppingSection section}.
 *
 * If the {@link direction} value is "include", the coupon can only be used
 * for the target {@link sections}. Conversely, if it is "exclude", the
 * coupon cannot be used.
 *
 * @author Samchon
 */
export interface IShoppingCouponSectionCriteria
  extends IShoppingCouponCriteriaBase<"section"> {
  /**
   * Target sections to include or exclude.
   */
  sections: IShoppingSection[] & tags.MinItems<1>;
}
export namespace IShoppingCouponSectionCriteria {
  /**
   * Creation information of the section criteria.
   */
  export interface ICreate
    extends IShoppingCouponCriteriaBase.ICreate<"section"> {
    /**
     * List of target section's {@link IShoppingSection.code}s.
     */
    section_codes: string[] & tags.MinItems<1>;
  }
}
