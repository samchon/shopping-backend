import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingCustomer } from "../actors/IShoppingCustomer";
import { IShoppingSale } from "../sales/IShoppingSale";
import { IShoppingOrderGood } from "./IShoppingOrderGood";
import { IShoppingOrderPrice } from "./IShoppingOrderPrice";
import { IShoppingOrderPublish } from "./IShoppingOrderPublish";

export interface IShoppingOrder {
    id: string & tags.Format<"uuid">;
    customer: IShoppingCustomer;
    goods: IShoppingOrderGood[] & tags.MinItems<1>;
    price: IShoppingOrderPrice;
    created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingOrder {
    export interface IRequest extends IPage.IRequest {
        search?: IRequest.ISearch;
        sort?: IPage.Sort<IRequest.SortableColumns>;
    }
    export namespace IRequest {
        export interface ISearch {
            min_price?: number;
            max_price?: number;
            paid?: null | boolean;
            sale?: IShoppingSale.IRequest.ISearch;
        }
        export type SortableColumns =
            | "order.price"
            | `order.quantity`
            | "order.created_at"
            | `order.paid_at`;
    }
    export interface ISummary {
        id: string & tags.Format<"uuid">;
        goods: IShoppingOrderGood[];
        price: IShoppingOrderPrice.ISummary;
        publish: null | IShoppingOrderPublish.ISummary;
        created_at: string & tags.Format<"date-time">;
    }

    export interface IStore {
        goods: IShoppingOrderGood.IStore[];
    }
}
