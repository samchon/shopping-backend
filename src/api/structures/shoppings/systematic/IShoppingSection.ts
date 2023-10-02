import { tags } from "typia";

import { IPage } from "../../common/IPage";

export interface IShoppingSection {
    id: string & tags.Format<"uuid">;
    code: string;
    name: string;
    created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingSection {
    export interface IRequest extends IPage.IRequest {
        search?: IRequest.ISearch;
        sort?: IPage.Sort<IRequest.SortableColumns>;
    }
    export namespace IRequest {
        export interface ISearch {
            code?: string;
            name?: string;
        }
        export type SortableColumns = "section.code" | "section.name";
    }

    export interface IStore {
        code: string;
        name: string;
    }
    export type IUpdate = Partial<IStore>;
}
