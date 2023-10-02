import { tags } from "typia";

import { IShoppingCouponCriteria } from "./IShoppingCouponCriteria";

export interface IShoppingCouponCriteriaBase<
    Type extends IShoppingCouponCriteria.Type,
> {
    id: string & tags.Format<"uuid">;
    type: Type;
    direction: "include" | "exclude";
}
export namespace IShoppingCouponCriteriaBase {
    export interface IStore<Type extends IShoppingCouponCriteria.Type> {
        type: Type;
        direction: "include" | "exclude";
    }
}
