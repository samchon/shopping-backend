import { tags } from "typia";

export interface IShoppingDiscountable<Combination> {
    deposit: number;
    mileage: number;
    combinations: Combination[] & tags.MinItems<1>;
}
