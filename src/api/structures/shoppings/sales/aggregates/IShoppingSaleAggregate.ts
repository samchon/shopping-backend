import { tags } from "typia";

export interface IShoppingSaleAggregate {
  count: number & tags.Type<"uint32">;
  opened_count: number & tags.Type<"uint32">;
  paused_count: number & tags.Type<"uint32">;
  suspended_count: number & tags.Type<"uint32">;
}
