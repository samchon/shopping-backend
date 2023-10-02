import { tags } from "typia";

export namespace IShoppingDeliveryPiece {
    export interface IStore {
        good_id: string & tags.Format<"uuid">;
        commodity_stock_id: string & tags.Format<"uuid">;
        quantity: number & tags.Minimum<0>;
    }
}
