import { tags } from "typia";

import { IPage } from "../../common/IPage";

export interface IShoppingDeposit extends IShoppingDeposit.ICreate {
  id: string & tags.Format<"uuid">;
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingDeposit {
  export type Direction = 1 | -1;

  export interface IRequest extends IPage.IRequest {
    search?: null | IRequest.ISearch;
    sort?: null | IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export interface ISearch {
      source?: null | string;
      code?: null | string;
      direction?: null | Direction;
    }
    export type SortableColumns =
      | "deposit.source"
      | "deposit.code"
      | "deposit.direction";
  }

  /**
   * @internal
   */
  export interface ICreate {
    code: string;
    source: string;
    direction: Direction;
  }
}
