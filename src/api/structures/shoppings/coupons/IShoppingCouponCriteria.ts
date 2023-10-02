import { IShoppingCouponChannelCriteria } from "./IShoppingCouponChannelCriteria";
import { IShoppingCouponFunnelCriteria } from "./IShoppingCouponFunnelCriteria";
import { IShoppingCouponSaleCriteria } from "./IShoppingCouponSaleCriteria";
import { IShoppingCouponSectionCriteria } from "./IShoppingCouponSectionCriteria";
import { IShoppingCouponSellerCriteria } from "./IShoppingCouponSellerCriteria";

export type IShoppingCouponCriteria =
    | IShoppingCouponChannelCriteria
    | IShoppingCouponSectionCriteria
    | IShoppingCouponSellerCriteria
    | IShoppingCouponSaleCriteria
    | IShoppingCouponFunnelCriteria;
export namespace IShoppingCouponCriteria {
    export type Type =
        | "channel"
        | "section"
        | "company"
        | "brand"
        | "seller"
        | "sale"
        | "funnel";

    export type IStore =
        | IShoppingCouponChannelCriteria.IStore
        | IShoppingCouponSectionCriteria.IStore
        | IShoppingCouponSellerCriteria.IStore
        | IShoppingCouponSaleCriteria.IStore
        | IShoppingCouponFunnelCriteria.IStore;
}
