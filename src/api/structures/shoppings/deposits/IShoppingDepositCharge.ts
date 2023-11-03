import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingCustomer } from "../actors/IShoppingCustomer";
import { IShoppingDepositChargePublish } from "./IShoppingDepositChargePublish";

export interface IShoppingDepositCharge extends IShoppingDepositCharge.ICreate {
    id: string & tags.Format<"uuid">;
    customer: IShoppingCustomer;
    publish: null | IShoppingDepositChargePublish;
    created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingDepositCharge {
    export interface IRequest extends IPage.IRequest {
        search?: IRequest.ISearch;
        sort?: IPage.Sort<IRequest.SortableColumns>;
    }
    export namespace IRequest {
        export interface ISearch {
            from?: string & tags.Format<"date-time">;
            to?: string & tags.Format<"date-time">;
        }
        export type SortableColumns =
            | "charge.created_at"
            | "charge.value"
            | "charge.publish.created_at"
            | "charge.publish.paid_at";
    }
    export interface ICreate {
        value: number;
    }
    export type IUpdate = ICreate;
}