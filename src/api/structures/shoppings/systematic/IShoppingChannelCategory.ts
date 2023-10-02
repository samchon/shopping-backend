import { tags } from "typia";

export interface IShoppingChannelCategory
    extends IShoppingChannelCategory.IBase {
    parent_id: null | (string & tags.Format<"uuid">);
    children: IShoppingChannelCategory[];
}
export namespace IShoppingChannelCategory {
    export interface IInvert extends IBase {
        parent: null | IShoppingChannelCategory;
    }

    export interface IBase {
        id: string & tags.Format<"uuid">;
        name: string;
        created_at: string & tags.Format<"date-time">;
    }

    export interface IStore {
        parent_id: null | (string & tags.Format<"uuid">);
        name: string;
    }
    export type IUpdate = Partial<IStore>;
}
