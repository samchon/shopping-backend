import { tags } from "typia";

import { IPage } from "../../common/IPage";

export interface IShoppingChannel {
    id: string & tags.Format<"uuid">;
    code: string;
    name: string;
    exclusive: boolean;
    created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingChannel {
    export interface IHierarchical extends IShoppingChannel {
        categories: IHierarchical[];
    }

    export interface IRequest extends IPage.IRequest {
        search?: IRequest.ISearch;
        sort?: IPage.Sort<IRequest.SortableColumns>;
    }
    export namespace IRequest {
        export interface ISearch {
            code?: string;
            name?: string;
        }
        export type SortableColumns = "channel.code" | "channel.name";
    }

    export interface IStore {
        code: string;
        name: string;
    }
    export type IUpdate = Partial<IStore>;
}
