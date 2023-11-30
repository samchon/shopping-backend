import { tags } from "typia";

export interface IShoppingSaleRefundAggregate {
  count: number & tags.Type<"uint32">;
  amount: number & tags.Minimum<0>;
}
