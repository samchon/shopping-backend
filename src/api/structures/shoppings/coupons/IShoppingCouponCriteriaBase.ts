import { IShoppingCouponCriteria } from "./IShoppingCouponCriteria";

/**
 * Supertype for the applicable conditions of the discount coupon.
 *
 * `IShoppingCouponCriteriaBase` is a supertype entity that embodies the
 * conditions for applying a {@link IShoppingCoupon discount coupon}. All
 * subtype entities that wish to impose constraints on the reference unit of
 * a discount coupon were created by inheriting this. For example, the
 * {@link IShoppingCouponSectionCriteria} entity, designed to limit
 * application to a specific {@link IShoppingSection section}, inherits this
 * entity `IShoppingCouponCriteriaBase`.
 *
 * In addition, constraints on reference units can be specified through the
 * {@link direction} property to proceed as an inclusion condition or,
 * conversely, as an exclusion condition. If the direction value is "include",
 * the coupon is applicable only to the reference object. Conversely, if the
 * direction value is "exclude", it is a coupon that cannot be applied to the
 * reference object.
 *
 * @author Samchon
 */
export interface IShoppingCouponCriteriaBase<
  Type extends IShoppingCouponCriteria.Type,
> {
  /**
   * Descrimanator type.
   */
  type: Type;

  /**
   * Direction of the criteria.
   */
  direction: "include" | "exclude";
}
export namespace IShoppingCouponCriteriaBase {
  /**
   * Creation information of the basic coupon criteria.
   */
  export interface ICreate<Type extends IShoppingCouponCriteria.Type> {
    type: Type;
    direction: "include" | "exclude";
  }
}
