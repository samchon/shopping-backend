import { tags } from "typia";

import { IShoppingCouponTicket } from "./IShoppingCouponTicket";

export interface IShoppingCouponTicketPayment {
    id: string & tags.Format<"uuid">;
    ticket: IShoppingCouponTicket;
    created_at: string & tags.Format<"date-time">;
}
