import { tags } from "typia";

import { IShoppingChannel } from "../systematic/IShoppingChannel";
import { IShoppingChannelCategory } from "../systematic/IShoppingChannelCategory";
import { IShoppingCouponCriteriaBase } from "./IShoppingCouponCriteriaBase";

/**
 * Conditions for channels of discount coupons.
 *
 * `ishoppingcouponchannelcriteria` is a subtype entity of
 * {@link IShoppingCouponCriteriaBase} and is used when setting conditions on
 * a specific {@link IShoppingChannel channel} or
 * {@link IShoppingChannelCategory category} of that channel.
 *
 * If the {@link direction} value is "include", the coupon can only be used
 * for the target channels (or categories). Conversely, if it is "exclude",
 * it is a coupon that cannot be used.
 *
 * @author Samchon
 */
export interface IShoppingCouponChannelCriteria
  extends IShoppingCouponCriteriaBase<"channel"> {
  /**
   * List of target channels and categories.
   */
  channels: IShoppingCouponChannelCriteria.IChannelTo[] & tags.MinItems<1>;
}
export namespace IShoppingCouponChannelCriteria {
  export interface IChannelTo {
    /**
     * Target channel.
     */
    channel: IShoppingChannel;

    /**
     * List of target categories.
     */
    categories: null | (IShoppingChannelCategory.IInvert[] & tags.MinItems<1>);
  }
  export namespace IChannelTo {
    /**
     * Target channel and categories.
     */
    export interface ICreate {
      /**
       * Target channel's {@link IShoppingChannel.code}.
       */
      channel_code: string;

      /**
       * Target categories' {@link IShoppingChannelCategory.id}s.
       */
      category_ids: null | Array<string & tags.Format<"uuid">>;
    }
  }

  /**
   * Creation information of the channel criteria.
   */
  export interface ICreate
    extends IShoppingCouponCriteriaBase.ICreate<"channel"> {
    /**
     * List of target channels and categories.
     */
    channels: IChannelTo.ICreate[] & tags.MinItems<1>;
  }
}
