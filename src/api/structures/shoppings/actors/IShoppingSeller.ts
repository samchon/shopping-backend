import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingMember } from "./IShoppingMember";

export interface IShoppingSeller extends IShoppingMember {
    type: "seller";
}
export namespace IShoppingSeller {
    export interface IAuthorized extends IShoppingSeller {
        setHeaders: {
            "shopping-seller-authorization": string;
        };
        expired_at: string & tags.Format<"date-time">;
    }

    export interface IRequest extends IPage.IRequest {
        search?: IRequest.ISearch;
        sort?: IPage.Sort<IRequest.SortableColumns>;
    }
    export namespace IRequest {
        export interface ISearch {
            id?: string & tags.Format<"uuid">;
            mobile?: string & tags.Pattern<"^[0-9]*$">;
            name?: string;
            email?: string & tags.Format<"email">;
            nickname?: string;
        }
        export type SortableColumns =
            | "seller.created_at"
            | "seller.goods.payments.real"
            | "seller.goods.published_count"
            | "seller.reviews.average"
            | "seller.reviews.count";
    }

    export interface IStore extends IShoppingMember.IStore {}
}
export namespace IShoppingSeller {
    export interface IAuthorized extends IShoppingSeller {
        setHeaders: { "shopping-seller-authorization": string };
        expired_at: string & tags.Format<"date-time">;
    }
}
