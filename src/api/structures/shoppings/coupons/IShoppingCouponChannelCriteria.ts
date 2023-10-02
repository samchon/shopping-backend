import { tags } from "typia";

import { IShoppingChannel } from "../systematic/IShoppingChannel";
import { IShoppingChannelCategory } from "../systematic/IShoppingChannelCategory";
import { IShoppingCouponCriteriaBase } from "./IShoppingCouponCriteriaBase";

export interface IShoppingCouponChannelCriteria
    extends IShoppingCouponCriteriaBase<"channel"> {
    channels: IShoppingCouponChannelCriteria.IChannelTo[];
}
export namespace IShoppingCouponChannelCriteria {
    export interface IChannelTo {
        channel: IShoppingChannel;
        categories:
            | null
            | (IShoppingChannelCategory.IInvert[] & tags.MinItems<1>);
    }
    export namespace IChannelTo {
        export interface IStore {
            channel_code: string;
            category_ids: null | Array<string & tags.Format<"uuid">>;
        }
    }

    export interface IStore
        extends IShoppingCouponCriteriaBase.IStore<"channel"> {
        channels: IChannelTo.IStore[];
    }
}
