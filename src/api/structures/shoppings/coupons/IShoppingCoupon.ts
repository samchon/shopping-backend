import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingAdministrator } from "../actors/IShoppingAdministrator";
import { IShoppingSeller } from "../actors/IShoppingSeller";
import { IShoppingCouponCriteria } from "./IShoppingCouponCriteria";
import { IShoppingCouponDiscount } from "./IShoppingCouponDiscount";
import { IShoppingCouponInventory } from "./IShoppingCouponInventory";
import { IShoppingCouponRestriction } from "./IShoppingCouponRestriction";

/**
 * Discount coupon.
 *
 * `IShoppingCoupon` is an entity that symbolizes discount coupons at
 * a shopping mall.
 *
 * Note that, `IShoppingCoupon` only contains specification information
 * about discount coupons. Please keep in mind that this is a different
 * concept from {@link IShoppingCouponTicket}, which refers to the issuance
 * of a discount coupon, or {@link IShoppingCouponTicketPayment}, which
 * refers to its payment.
 *
 * Additionally, discount coupons are applied on an order-by-order basis,
 * but each has its own unique restrictions. For example, a coupon with
 * {@link IShoppingCouponSellerCriteria} may or may not be used only for
 * {@link IShoppingSale} of listings registered by the {@link IShoppingSeller}.
 * Also, there are restrictions such as
 * {@link IShoppingCouponDiscount.threshold minimum amount restrictions} for
 * using discount coupons and
 * {@link IShoppingCouponDiscount.limit maximum discount amount limits}.
 *
 * In addition, you can set whether to issue discount coupons publicly or
 * give them only to people who know the specific issuing code. In addition,
 * there are restrictions such as issued discount coupons having an
 * {@link IShoppingCouponRestriction.expired_at expiration date} or being
 * issued only to customers who came in through a
 * {@link IShoppingCouponFunnelCriteria specific funnel}.
 *
 * For more information, please refer to the properties below and the
 * subsidiary entities described later.
 *
 * @author Samchon
 */
export interface IShoppingCoupon {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Designer who've made the coupon.
   */
  designer: IShoppingAdministrator | IShoppingSeller;

  /**
   * Inventory information.
   */
  inventory: IShoppingCouponInventory;

  /**
   * List of criteria informations.
   */
  criterias: IShoppingCouponCriteria[];

  /**
   * Discount information.
   */
  discount: IShoppingCouponDiscount;

  /**
   * Restriction information.
   */
  restriction: IShoppingCouponRestriction;

  /**
   * Representative name of the coupon.
   */
  name: string;

  /**
   * Opening time of the coupon.
   */
  opened_at: null | (string & tags.Format<"date-time">);

  /**
   * Closing time of the coupon.
   *
   * Tickets cannot be issued after this time.
   *
   * However, previously issued tickets can still be used until their
   * expiration date.
   */
  closed_at: null | (string & tags.Format<"date-time">);

  /**
   * Creation tie of the record.
   */
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingCoupon {
  export interface IRequest extends IPage.IRequest {
    search?: null | IRequest.ISearch;
    sort?: null | IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export interface ISearch {
      name?: null | string;
    }
    export type SortableColumns =
      | "coupon.name"
      | "coupon.unit"
      | "coupon.value"
      | "coupon.created_at"
      | "coupon.opened_at"
      | "coupon.closed_at";
  }

  /**
   * Creation information of the coupon.
   */
  export interface ICreate {
    /**
     * Discount information.
     */
    discount: IShoppingCouponDiscount;

    /**
     * Restriction information.
     */
    restriction: IShoppingCouponRestriction;

    criterias: IShoppingCouponCriteria.ICreate[];

    disposable_codes: string[];

    /**
     * Representative name of the coupon.
     */
    name: string;

    /**
     * Opening time of the coupon.
     */
    opened_at: null | (string & tags.Format<"date-time">);

    /**
     * Closing time of the coupon.
     *
     * Tickets cannot be issued after this time.
     *
     * However, previously issued tickets can still be used until their
     * expiration date.
     */
    closed_at: null | (string & tags.Format<"date-time">);
  }
}
