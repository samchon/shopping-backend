import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingSale } from "../sales/IShoppingSale";
import { IShoppingSaleSnapshot } from "../sales/IShoppingSaleSnapshot";
import { IShoppingCartCommodityStock } from "./IShoppingCartCommodityStock";

export interface IShoppingCartCommodity {
    id: string & tags.Format<"uuid">;
    sale: IShoppingSaleSnapshot.IInvert;
    orderable: boolean;
    fake: boolean;
    volume: number & tags.Type<"uint32">;
    created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingCartCommodity {
    export interface IRequest extends IPage.IRequest {
        search?: IRequest.ISearch;
        sort?: IPage.Sort<IRequest.SortableColumns>;
    }
    export namespace IRequest {
        export interface ISearch {
            min_price?: number;
            max_price?: number;
            sale?: IShoppingSale.IRequest.ISearch;
        }
        export type SortableColumns =
            | IShoppingSale.IRequest.SortableColumns
            | "commodity.price"
            | "commodity.created_at";
    }

    export interface IStore {
        sale_id: string & tags.Format<"uuid">;
        stocks: IShoppingCartCommodityStock.IStore[] & tags.MinItems<1>;
    }
}
