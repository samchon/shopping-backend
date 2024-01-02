import { IShoppingCouponChannelCriteria } from "./IShoppingCouponChannelCriteria";
import { IShoppingCouponFunnelCriteria } from "./IShoppingCouponFunnelCriteria";
import { IShoppingCouponSaleCriteria } from "./IShoppingCouponSaleCriteria";
import { IShoppingCouponSectionCriteria } from "./IShoppingCouponSectionCriteria";
import { IShoppingCouponSellerCriteria } from "./IShoppingCouponSellerCriteria";

/**
 * Union type of the criteria.
 *
 * `IShoppingCouponCriteria` is an union typed structure that embodies the
 * conditions for applying a {@link IShoppingCoupon discount coupon}. All
 * of individual entities are imposing constraints on the reference unit of
 * a discount coupon were created by inheritig
 * {@link IShoppingCouponCriteriaBase} type.
 *
 * Also, individual entities can be specified by using the if condition on
 * the {@link type} property. For example, if the {@link type} value is
 * `section`, {@link IShoppingCouponSectionCriteria} type would be specified,
 * so that you can access to the target
 * {@link IShoppingCouponSectionCriteria.section} directly. For reference,
 * this concept is called a descriminated union in TypeScript.
 *
 * ```typescript
 * const union: IShoppingCouponCriteria;
 * if (union.type === "section")
 *     union.section; // IShoppingCouponSectionCriteria.section
 * ```
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
export type IShoppingCouponCriteria =
  | IShoppingCouponChannelCriteria
  | IShoppingCouponSectionCriteria
  | IShoppingCouponSellerCriteria
  | IShoppingCouponSaleCriteria
  | IShoppingCouponFunnelCriteria;
export namespace IShoppingCouponCriteria {
  /**
   * Type of the criteria, the descriminator.
   */
  export type Type = "channel" | "section" | "seller" | "sale" | "funnel";

  /**
   * Union type of the creation information of the criteria.
   */
  export type ICreate =
    | IShoppingCouponChannelCriteria.ICreate
    | IShoppingCouponSectionCriteria.ICreate
    | IShoppingCouponSellerCriteria.ICreate
    | IShoppingCouponSaleCriteria.ICreate
    | IShoppingCouponFunnelCriteria.ICreate;

  /**
   * @internal
   */
  export interface ICollectBase {
    id: string;
    direction: "include" | "exclude";
    type: Type;
  }
}
