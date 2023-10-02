import { tags } from "typia";

import { IShoppingChannel } from "../systematic/IShoppingChannel";
import { IShoppingChannelCategory } from "../systematic/IShoppingChannelCategory";

export interface IShoppingSaleChannel extends IShoppingChannel {
    categories: IShoppingChannelCategory.IInvert[];
}
export namespace IShoppingSaleChannel {
    export interface IStore {
        code: string;
        category_ids: Array<string & tags.Format<"uuid">>;
    }
}
