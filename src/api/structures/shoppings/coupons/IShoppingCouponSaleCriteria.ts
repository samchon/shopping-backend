import { tags } from "typia";

import { IShoppingSale } from "../sales/IShoppingSale";
import { IShoppingCouponCriteriaBase } from "./IShoppingCouponCriteriaBase";

/**
 * Conditions for sales of discount coupons.
 *
 * `IShoppingCouponSaleCriteria` is a subtype entity of
 * {@link IShoppingCouponCriteriaBase} and is used when setting conditions
 * for a specific {@link IShoppingSale sale}.
 *
 * If the {@link direction} value is "include", the coupon can only be used
 * for the target {@link sales}. Conversely, if it is "exclude", the
 * coupon cannot be used.
 *
 * @author Samchon
 */
export interface IShoppingCouponSaleCriteria
  extends IShoppingCouponCriteriaBase<"sale"> {
  /**
   * Target sales to include or exclude.
   */
  sales: IShoppingSale.ISummary[] & tags.MinItems<1>;
}
export namespace IShoppingCouponSaleCriteria {
  /**
   * Creation information of the sale criteria.
   */
  export interface ICreate extends IShoppingCouponCriteriaBase.ICreate<"sale"> {
    /**
     * List of target sale's {@link IShoppingSale.id}s.
     */
    sale_ids: Array<string & tags.Format<"uuid">> & tags.MinItems<1>;
  }
}
