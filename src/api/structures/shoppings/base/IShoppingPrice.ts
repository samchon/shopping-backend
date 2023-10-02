import { tags } from "typia";

export interface IShoppingPrice {
    nominal: number & tags.Minimum<0>;
    real: number & tags.Minimum<0>;
}
