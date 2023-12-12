import { tags } from "typia";

export interface IShoppingDeposit extends IShoppingDeposit.ICreate {
  id: string & tags.Format<"uuid">;
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingDeposit {
  export interface ICreate {
    code: string;
    source: string;
    direction: 1 | -1;
  }
}
