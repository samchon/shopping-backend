import { tags } from "typia";

import { IShoppingCoupon } from "./IShoppingCoupon";
import { IShoppingCouponTicket } from "./IShoppingCouponTicket";

export interface IShoppingCouponCombination<
  Entry extends IShoppingCouponCombination.IEntry,
> {
  coupons: IShoppingCoupon[];
  tickets: IShoppingCouponTicket[];
  entries: Entry[];
  amount: number;
}
export namespace IShoppingCouponCombination {
  export interface IEntry {
    coupon_id: string & tags.Format<"uuid">;
    amount: number;
  }
}
