import { tags } from "typia";

export interface IShoppingDeliveryShipper
  extends IShoppingDeliveryShipper.ICreate {
  id: string & tags.Format<"uuid">;
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingDeliveryShipper {
  export interface ICreate {
    company: null | string;
    name: string;
    mobile: string;
  }
}
