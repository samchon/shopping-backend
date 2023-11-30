import { tags } from "typia";

import { IShoppingCouponCombination } from "../coupons/IShoppingCouponCombination";
import { IShoppingDiscountable } from "../coupons/IShoppingDiscountable";
import { IShoppingCartCommodity } from "./IShoppingCartCommodity";

export type IShoppingCartDiscountable =
  IShoppingDiscountable<IShoppingCartDiscountable.ICombination>;
export namespace IShoppingCartDiscountable {
  export type ICombination = IShoppingCouponCombination<IEntry>;
  export interface IEntry extends IShoppingCouponCombination.IEntry {
    commodity_id: string & tags.Format<"uuid">;
    pseudo: boolean;
  }

  export interface IRequest {
    commodity_ids: Array<string & tags.Format<"uuid">> | null;
    pseudos: IShoppingCartCommodity.ICreate[];
  }
}
