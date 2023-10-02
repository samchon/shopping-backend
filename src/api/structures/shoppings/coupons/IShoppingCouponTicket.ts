import { tags } from "typia";

import { IShoppingCustomer } from "../actors/IShoppingCustomer";
import { IShoppingCoupon } from "./IShoppingCoupon";

export interface IShoppingCouponTicket {
    id: string & tags.Format<"uuid">;
    customer: IShoppingCustomer;
    coupon: IShoppingCoupon;
    created_at: string & tags.Format<"date-time">;
    expired_at: null | (string & tags.Format<"date-time">);
}
