import { tags } from "typia";

export interface IShoppingDepositChargePublish {
  id: string & tags.Format<"uuid">;
  created_at: string & tags.Format<"date-time">;
  paid_at: null | (string & tags.Format<"date-time">);
  cancelled_at: null | (string & tags.Format<"date-time">);
}
export namespace IShoppingDepositChargePublish {
  export interface ICreate {
    vendor: string;
    uid: string;
  }
}
