import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingCustomer } from "../actors/IShoppingCustomer";
import { IShoppingCoupon } from "./IShoppingCoupon";

/**
 * Discount coupon ticket issuance details.
 *
 * `IShoppingCouponTicket` is an entity that symbolizes
 * {@link IShoppingCoupon discount coupon} tickets issued by
 * {@link IShoppingCustomer customers}.
 *
 * And if the target discount coupon specification itself has an expiration
 * date, the expiration date is recorded in expired_at and is automatically
 * discarded after that expiration date. Of course, it doesn't matter if you
 * use the discount coupon for your order within the deadline.
 *
 * @author Samchon
 */
export interface IShoppingCouponTicket {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Customer who've taken the coupon ticket.
   */
  customer: IShoppingCustomer;

  /**
   * Target coupon.
   */
  coupon: IShoppingCoupon;

  /**
   * Creation time of the record.
   */
  created_at: string & tags.Format<"date-time">;

  /**
   * Expiration time of the ticket.
   */
  expired_at: null | (string & tags.Format<"date-time">);
}
export namespace IShoppingCouponTicket {
  export interface IRequest extends IPage.IRequest {
    sort?: null | IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export type SortableColumns = "ticket.created_at" | "ticket.expired_at";
  }

  export interface ITake {
    code: string;
  }

  export interface ICreate {
    coupon_id: string & tags.Format<"uuid">;
  }
}
