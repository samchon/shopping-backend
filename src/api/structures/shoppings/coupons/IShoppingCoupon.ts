import { tags } from "typia";

import { IShoppingAdministrator } from "../actors/IShoppingAdministrator";
import { IShoppingSeller } from "../actors/IShoppingSeller";
import { IShoppingCouponCriteria } from "./IShoppingCouponCriteria";
import { IShoppingCouponDiscount } from "./IShoppingCouponDiscount";
import { IShoppingCouponInventory } from "./IShoppingCouponInventory";
import { IShoppingCouponRestriction } from "./IShoppingCouponRestriction";

export interface IShoppingCoupon {
    id: string & tags.Format<"uuid">;
    designer: IShoppingAdministrator | IShoppingSeller;
    discount: IShoppingCouponDiscount;
    restriction: IShoppingCouponRestriction;
    inventory: IShoppingCouponInventory;
    criterias: IShoppingCouponCriteria[];
    name: string;
    created_at: string & tags.Format<"date-time">;
    opened_at: null | (string & tags.Format<"date-time">);
    closed_at: null | (string & tags.Format<"date-time">);
}
export namespace IShoppingCoupon {
    export interface IStore {
        discount: IShoppingCouponDiscount;
        restriction: IShoppingCouponRestriction;
        name: string;
        opened_at: null | (string & tags.Format<"date-time">);
        closed_at: null | (string & tags.Format<"date-time">);
    }
}
