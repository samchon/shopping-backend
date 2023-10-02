import { tags } from "typia";

import { IShoppingSeller } from "../actors/IShoppingSeller";
import { IShoppingCouponCriteriaBase } from "./IShoppingCouponCriteriaBase";

export interface IShoppingCouponSellerCriteria
    extends IShoppingCouponCriteriaBase<"seller"> {
    sellers: IShoppingSeller[];
}
export namespace IShoppingCouponSellerCriteria {
    export interface IStore
        extends IShoppingCouponCriteriaBase.IStore<"seller"> {
        seller_ids: Array<string & tags.Format<"uuid">>;
    }
}
