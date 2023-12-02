import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSystematicChannelCategoriesController(
  props: IShoppingControllerProps,
) {
  @Controller(
    `shoppings/${props.path}/systematic/channels/:channelCode/categories`,
  )
  class ShoppingSystematicChannelCategoriesController {
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() _actor: unknown,
      @core.TypedParam("channelCode") channelCode: string,
    ): Promise<IShoppingChannelCategory.IHierarchical[]> {
      channelCode;
      return null!;
    }

    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() _actor: unknown,
      @core.TypedParam("channelCode") channelCode: string,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingChannelCategory> {
      channelCode;
      id;
      return null!;
    }

    @core.TypedRoute.Get(":id/invert")
    public async invert(
      @props.AuthGuard() _actor: unknown,
      @core.TypedParam("channelCode") channelCode: string,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingChannelCategory.IInvert> {
      channelCode;
      id;
      return null!;
    }
  }
  return ShoppingSystematicChannelCategoriesController;
}
