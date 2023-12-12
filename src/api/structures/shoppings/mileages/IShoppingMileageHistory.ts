import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingMileage } from "./IShoppingMileage";

export interface IShoppingMileageHistory {
  id: string & tags.Format<"uuid">;
  mileage: IShoppingMileage;
  value: number;
  balance: number;
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingMileageHistory {
  export interface IRequest extends IPage.IRequest {
    search?: IRequest.ISearch;
    sort?: IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export interface ISearch {
      mileage?: {
        code?: string;
        direction?: 1 | -1;
      };
      from?: string & tags.Format<"date-time">;
      to?: string & tags.Format<"date-time">;
    }
    export type SortableColumns =
      | "history.mileage.code"
      | "history.created_at"
      | "history.value"
      | "history.directedValue";
  }
}
