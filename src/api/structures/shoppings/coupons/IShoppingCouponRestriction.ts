import { tags } from "typia";

export interface IShoppingCouponRestriction {
    access: "public" | "private";
    exclusive: boolean;
    volume: null | (number & tags.Type<"uint32">);
    volume_per_citizen: null | (number & tags.Type<"uint32">);
    expired_in: null | (number & tags.Type<"uint32">);
    expired_at: null | (string & tags.Format<"date-time">);
}
