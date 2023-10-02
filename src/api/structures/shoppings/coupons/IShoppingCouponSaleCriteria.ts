import { tags } from "typia";

import { IShoppingSale } from "../sales/IShoppingSale";
import { IShoppingCouponCriteriaBase } from "./IShoppingCouponCriteriaBase";

export interface IShoppingCouponSaleCriteria
    extends IShoppingCouponCriteriaBase<"sale"> {
    sales: IShoppingSale[];
}
export namespace IShoppingCouponSaleCriteria {
    export interface IStore extends IShoppingCouponCriteriaBase.IStore<"sale"> {
        sale_ids: Array<string & tags.Format<"uuid">>;
    }
}
