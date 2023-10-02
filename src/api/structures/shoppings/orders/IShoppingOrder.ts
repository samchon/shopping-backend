import { tags } from "typia";

import { IShoppingCustomer } from "../actors/IShoppingCustomer";
import { IShoppingOrderGood } from "./IShoppingOrderGood";
import { IShoppingOrderPrice } from "./IShoppingOrderPrice";

export interface IShoppingOrder {
    id: string & tags.Format<"uuid">;
    customer: IShoppingCustomer;
    goods: IShoppingOrderGood[] & tags.MinItems<1>;
    price: IShoppingOrderPrice;
    created_at: string & tags.Format<"date-time">;
}
