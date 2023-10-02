import { IShoppingSection } from "../systematic/IShoppingSection";
import { IShoppingCouponCriteriaBase } from "./IShoppingCouponCriteriaBase";

export interface IShoppingCouponSectionCriteria
    extends IShoppingCouponCriteriaBase<"section"> {
    sections: IShoppingSection[];
}
export namespace IShoppingCouponSectionCriteria {
    export interface IStore
        extends IShoppingCouponCriteriaBase.IStore<"section"> {
        section_codes: string[];
    }
}
