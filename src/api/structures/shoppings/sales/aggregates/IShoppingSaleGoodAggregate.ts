import { tags } from "typia";

export interface IShoppingSaleGoodAggregate {
  knock_count: number & tags.Type<"uint32">;
  publish_count: number & tags.Type<"uint32">;
  confirm_count: number & tags.Type<"uint32">;
  nominal_payment_amount: number & tags.Minimum<0>;
  real_payment_amount: number & tags.Minimum<0>;
  ticket_payment_amount: number & tags.Minimum<0>;
}
