import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingDeposit } from "./IShoppingDeposit";

export interface IShoppingDepositHistory {
  id: string & tags.Format<"uuid">;
  deposit: IShoppingDeposit;
  value: number;
  balance: number;
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingDepositHistory {
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
      | "deposit.code"
      | "history.created_at"
      | "history.value";
  }
}
