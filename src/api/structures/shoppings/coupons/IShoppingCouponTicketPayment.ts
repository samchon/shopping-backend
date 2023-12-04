import { tags } from "typia";

import { IShoppingCouponTicket } from "./IShoppingCouponTicket";

/**
 * Discount coupon ticket payment details.
 *
 * `IShoppingCouponTicketPayment` is an entity that embodies the payment
 * information for the {@link IShoppingOrder order} of
 * {@link IShoppingCouponTicket}, and is used when a consumer uses the
 * discount coupon ticket he or she was issued to order and has the payment
 * amount deducted.
 *
 * And since {@link IShoppingOrder} itself is not an entity used in
 * situations where an order is completed, but rather an entity designed to
 * express an order request, the creation of this
 * `IShoppingCouponTicketPayment` record does not actually mean that the
 * attached ticket disappears. Until the {@link IShoppingCustomer customer}
 * {@link IShoppingOrderPublish.paid_at completes the payment} and confirms
 * the order, the ticket can be understood as a kind of deposit.
 *
 * Additionally, this record can be deleted by the customer reversing the
 * payment of the ticket, but it can also be deleted when the attribution
 * order itself is cancelled.
 *
 * @author Samchon
 */
export interface IShoppingCouponTicketPayment {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Target ticket.
   */
  ticket: IShoppingCouponTicket;

  /**
   * Creation time of the record.
   */
  created_at: string & tags.Format<"date-time">;
}
