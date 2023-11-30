import { tags } from "typia";

import { IShoppingCouponCriteriaBase } from "./IShoppingCouponCriteriaBase";

/**
 * Limit the funnel of discount coupons.
 *
 * `ishoppingcouponfunnelcriteria` is a subtype entity of
 * {@link IShoppingCouponCriteria}, and is used when you want to issue or
 * exclude discount coupons only to {@link IShoppingCustomer customers} who
 * came from a specific path.
 *
 * And funnel restrictions are possible in 3 ways: The first is
 * {@link IShoppingCustomer.referrer}, and by parsing
 * {@link IShoppingCustomer.href}, which records the customer's access
 * address, restrictions can be made in units of specific URLs or variables.
 *
 * @author Samchon
 */
export interface IShoppingCouponFunnelCriteria
  extends IShoppingCouponCriteriaBase<"funnel"> {
  /**
   * List of target funnels.
   */
  funnels: Array<IShoppingCouponFunnelCriteria.IFunnel> & tags.MinItems<1>;
}
export namespace IShoppingCouponFunnelCriteria {
  /**
   * Union type of funnel restriction.
   */
  export type IFunnel = IValueFunnel | IVariableFunnel;

  /**
   * Kind of funnel restriction by a value.
   */
  export interface IValueFunnel {
    /**
     * Kind of funnel restriction.
     */
    kind: "url" | "referrer";

    /**
     * Target value.
     */
    value: string;
  }

  /**
   * Kind of funnel restriction by a variable.
   */
  export interface IVariableFunnel {
    /**
     * Kind of funnel restriction.
     */
    kind: "variable";

    /**
     * Target variable's key.
     */
    key: string;

    /**
     * Target variable's value.
     */
    value: string;
  }

  /**
   * Creation information of the funnel criteria.
   */
  export interface ICreate
    extends IShoppingCouponCriteriaBase.ICreate<"funnel"> {
    /**
     * List of target funnels.
     */
    funnels: Array<IFunnel> & tags.MinItems<1>;
  }
}
