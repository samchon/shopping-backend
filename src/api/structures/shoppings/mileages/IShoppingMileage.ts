import { tags } from "typia";

import { IPage } from "../../common/IPage";

export interface IShoppingMileage extends IShoppingMileage.ICreate {
  id: string & tags.Format<"uuid">;
  value: null | number;
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingMileage {
  export type Direction = 1 | -1;

  export interface ICreate {
    code: string;
    source: string;
    direction: Direction;
    value: null | number;
  }

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
