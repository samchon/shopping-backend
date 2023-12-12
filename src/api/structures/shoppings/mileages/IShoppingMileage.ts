import { tags } from "typia";

export interface IShoppingMileage extends IShoppingMileage.ICreate {
  id: string & tags.Format<"uuid">;
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingMileage {
  export interface ICreate {
    code: string;
    source: string;
    direction: 1 | -1;
  }
}
