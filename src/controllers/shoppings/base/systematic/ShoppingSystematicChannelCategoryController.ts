import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { ShoppingChannelCategoryProvider } from "../../../../providers/shoppings/systematic/ShoppingChannelCategoryProvider";
import { ShoppingChannelProvider } from "../../../../providers/shoppings/systematic/ShoppingChannelProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSystematicChannelCategoryController(
  props: IShoppingControllerProps
) {
  @Controller(
    `shoppings/${props.path}/systematic/channels/:channelCode/categories`
  )
  class ShoppingSystematicChannelCategoryController {
    /**
     * List up every categories with children records.
     *
     * List up every {@link IShoppingChannelCategory.IHierarchical categories}
     * of a {@link IShoppingChannel channel} with pagination. Returned categories
     * contain children categories, too.
     *
     * If you want, you can limit the result by configuring
     * {@link IShoppingChannelCategory.IRequest.search search condition} in the
     * request body. Also, it is possible to customize sequence order of records
     * by configuring {@link IShoppingChannelCategory.IRequest.sort sort condition}.
     *
     * @param channelCode Belonged channel's {@link IShoppingChannel.code}
     * @returns Paginated categories with children categories
     * @tag Systematic
     *
     * @author Samchon
     */
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() _actor: unknown,
      @core.TypedParam("channelCode") channelCode: string
    ): Promise<IShoppingChannelCategory.IHierarchical[]> {
      return ShoppingChannelCategoryProvider.hierarchical.entire(
        await ShoppingChannelProvider.get(channelCode)
      );
    }

    /**
     * Get a category info.
     *
     * Get a detailed {@link IShoppingChannelCategory category} information.
     *
     * Returned category contains hierarchical children categories, and also
     * contains the recursive parent categories, too.
     *
     * @param channelCode Belonged channel's {@link IShoppingChannel.code}
     * @param id Target category's {@link IShoppingChannelCategory.id}
     * @returns Detailed category info
     * @tag Systematic
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() _actor: unknown,
      @core.TypedParam("channelCode") channelCode: string,
      @core.TypedParam("id") id: string & tags.Format<"uuid">
    ): Promise<IShoppingChannelCategory> {
      return ShoppingChannelCategoryProvider.at({
        channel: await ShoppingChannelProvider.get(channelCode),
        id,
      });
    }

    /**
     * Get a category info of inverted.
     *
     * Get a inverted {@link IShoppingChannelCategory.IInvert category} information.
     *
     * Returned category contains the recursive parent categories, but not contains
     * the hierarchical children categories.
     *
     * @param channelCode Belonged channel's {@link IShoppingChannel.code}
     * @param id Target category's {@link IShoppingChannelCategory.id}
     * @returns Detailed category info
     * @tag Systematic
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":id/invert")
    public async invert(
      @props.AuthGuard() _actor: unknown,
      @core.TypedParam("channelCode") channelCode: string,
      @core.TypedParam("id") id: string & tags.Format<"uuid">
    ): Promise<IShoppingChannelCategory.IInvert> {
      return ShoppingChannelCategoryProvider.invert({
        channel: await ShoppingChannelProvider.get(channelCode),
        id,
      });
    }
  }
  return ShoppingSystematicChannelCategoryController;
}
