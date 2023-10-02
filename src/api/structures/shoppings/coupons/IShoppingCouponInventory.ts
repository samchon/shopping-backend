import { tags } from "typia";

export interface IShoppingCouponInventory {
    volume: null | (number & tags.Type<"uint32">);
    volume_per_citizen: null | (number & tags.Type<"uint32">);
}
