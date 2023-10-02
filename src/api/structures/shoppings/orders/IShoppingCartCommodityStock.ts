import { tags } from "typia";

import { IShoppingCartCommodityStockChoice } from "./IShoppingCartCommodityStockChoice";

export namespace IShoppingCartCommodityStock {
    export interface IStore {
        unit_id: string & tags.Format<"uuid">;
        choices: IShoppingCartCommodityStockChoice.IStore[];
    }
}
