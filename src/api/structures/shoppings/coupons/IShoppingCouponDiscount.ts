import { tags } from "typia";

export type IShoppingCouponDiscount =
    | IShoppingCouponDiscount.IAmount
    | IShoppingCouponDiscount.IPercent;
export namespace IShoppingCouponDiscount {
    export interface IAmount {
        unit: "percent";
        value: number & tags.Minimum<0> & tags.Maximum<100>;
        threshold: null | (number & tags.Minimum<0>);
        limit: null | (number & tags.ExclusiveMinimum<0>);
    }
    export interface IPercent {
        unit: "amount";
        value: number;
        threshold: null | (number & tags.Minimum<0>);
        limit: null | (number & tags.ExclusiveMinimum<0>);
    }
}
