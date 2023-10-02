import { tags } from "typia";

import { IShoppingCartCommodity } from "./IShoppingCartCommodity";
import { IShoppingOrderPrice } from "./IShoppingOrderPrice";

export interface IShoppingOrderGood {
    id: string & tags.Format<"uuid">;
    commodity: IShoppingCartCommodity;
    volume: number & tags.Type<"uint32">;
    price: IShoppingOrderPrice.ISummary;
    confirmed_at: null | (string & tags.Format<"date-time">);
}
