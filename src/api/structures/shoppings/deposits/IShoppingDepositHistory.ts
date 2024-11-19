import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingCitizen } from "../actors/IShoppingCitizen";
import { IShoppingDeposit } from "./IShoppingDeposit";

export interface IShoppingDepositHistory {
  id: string & tags.Format<"uuid">;
  citizen: IShoppingCitizen;
  deposit: IShoppingDeposit;
  source_id: string & tags.Format<"uuid">;
  value: number;
  balance: number;
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingDepositHistory {
  export interface IRequest extends IPage.IRequest {
    search?: null | IRequest.ISearch;
    sort?: null | IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export interface ISearch {
      deposit?: null | IShoppingDeposit.IRequest.ISearch;
      citizen_id?: null | (string & tags.Format<"uuid">);
      from?: null | (string & tags.Format<"date-time">);
      to?: null | (string & tags.Format<"date-time">);
      minimum?: null | (number & tags.Minimum<0>);
      maximum?: null | (number & tags.Minimum<0>);
    }
    export type SortableColumns =
      | "history.value"
      | "history.created_at"
      | IShoppingDeposit.IRequest.SortableColumns;
  }
}
