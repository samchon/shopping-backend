import { tags } from "typia";

import { IShoppingCouponCombination } from "../coupons/IShoppingCouponCombination";
import { IShoppingDiscountable } from "../coupons/IShoppingDiscountable";

export type IShoppingOrderDiscountable =
  IShoppingDiscountable<IShoppingOrderDiscountable.ICombination>;
export namespace IShoppingOrderDiscountable {
  export type ICombination = IShoppingCouponCombination<IEntry>;

  export interface IEntry extends IShoppingCouponCombination.IEntry {
    good_id: string & tags.Format<"uuid">;
  }

  export interface IRequest {
    good_ids: Array<string & tags.Format<"uuid">> | null;
  }
}
