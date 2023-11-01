import { tags } from "typia";

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
     * Creation time of the record.
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * Expiration time of the ticket.
     */
    expired_at: null | (string & tags.Format<"date-time">);
}
