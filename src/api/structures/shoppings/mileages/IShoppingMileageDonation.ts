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
  export interface IRequest extends IPage.IRequest {
    search?: null | IRequest.ISearch;
    sort?: null | IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export interface ISearch {
      citizen?: null | IShoppingCitizen.IRequest.ISearch;
      minimum?: null | (number & tags.Minimum<0>);
      maximum?: null | (number & tags.Minimum<0>);
      from?: null | (string & tags.Format<"date-time">);
      to?: null | (string & tags.Format<"date-time">);
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
