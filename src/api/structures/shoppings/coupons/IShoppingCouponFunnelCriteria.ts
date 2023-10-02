import { tags } from "typia";

import { IShoppingCouponCriteriaBase } from "./IShoppingCouponCriteriaBase";

export interface IShoppingCouponFunnelCriteria
    extends IShoppingCouponCriteriaBase<"funnel"> {
    funnels: Array<IShoppingCouponFunnelCriteria.IFunnel> & tags.MinLength<1>;
}
export namespace IShoppingCouponFunnelCriteria {
    export type IFunnel = IValueFunnel | IVariableFunnel;
    export interface IValueFunnel {
        kind: "url" | "referrer";
        value: string;
    }
    export interface IVariableFunnel {
        kind: "variable";
        key: string;
        value: string;
    }

    export interface IStore
        extends IShoppingCouponCriteriaBase.IStore<"funnel"> {
        funnels: Array<IFunnel> & tags.MinLength<1>;
    }
}
