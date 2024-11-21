import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingCitizen } from "../actors/IShoppingCitizen";
import { IShoppingMileage } from "./IShoppingMileage";

export interface IShoppingMileageHistory {
  id: string & tags.Format<"uuid">;
  citizen: IShoppingCitizen;
  mileage: IShoppingMileage;
  source_id: string & tags.Format<"uuid">;
  value: number;
  balance: number;
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingMileageHistory {
  export interface IRequest extends IPage.IRequest {
    search?: null | IRequest.ISearch;
    sort?: null | IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export interface ISearch {
      mileage?: null | IShoppingMileage.IRequest.ISearch;
      citizen_id?: null | (string & tags.Format<"uuid">);
      from?: null | (string & tags.Format<"date-time">);
      to?: null | (string & tags.Format<"date-time">);
      minimum?: null | (number & tags.Minimum<0>);
      maximum?: null | (number & tags.Minimum<0>);
    }
    export type SortableColumns =
      | "history.value"
      | "history.created_at"
      | IShoppingMileage.IRequest.SortableColumns;
  }
}
