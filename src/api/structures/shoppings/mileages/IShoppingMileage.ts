import { tags } from "typia";

import { IPage } from "../../common/IPage";

export interface IShoppingMileage extends IShoppingMileage.ICreate {
  id: string & tags.Format<"uuid">;
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingMileage {
  export type Direction = 1 | -1;

  export interface ICreate {
    code: string;
    source: string;
    direction: Direction;
  }

  export interface IRequest extends IPage.IRequest {
    search?: IRequest.ISearch;
    sort?: IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export interface ISearch {
      source?: string;
      code?: string;
      direction?: Direction;
    }
    export type SortableColumns =
      | "mileage.source"
      | "mileage.code"
      | "mileage.direction";
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
