import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingAdministrator } from "../actors/IShoppingAdministrator";
import { IShoppingCitizen } from "../actors/IShoppingCitizen";

export interface IShoppingMileageDonation {
  id: string & tags.Format<"uuid">;
  administrator: IShoppingAdministrator.IInvert;
  citizen: IShoppingCitizen;
  value: number;
  reason: string;
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingMileageDonation {
  export interface IRequest extends IPage.IRequest {}
  export namespace IRequest {
    export interface ISearch {
      from?: string & tags.Format<"date-time">;
      to?: string & tags.Format<"date-time">;
    }
    export type SortableColumns =
      | "donation.created_at"
      | "donation.value"
      | "donation.reason";
  }

  export interface ICreate {
    citizen_id: string & tags.Format<"uuid">;
    value: number;
    reason: string;
  }
}
