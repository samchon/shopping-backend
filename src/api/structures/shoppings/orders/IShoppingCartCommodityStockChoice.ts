import { tags } from "typia";

export namespace IShoppingCartCommodityStockChoice {
    export interface IStore {
        option_id: string & tags.Format<"uuid">;
        candidate_id: null | (string & tags.Format<"uuid">);
        value: null | string;
    }
}
