import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { ShoppingChannelProvider } from "../../../../providers/shoppings/systematic/ShoppingChannelProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSystematicChannelsController<
  Actor extends IShoppingActorEntity,
>(props: IShoppingControllerProps) {
  @Controller(`shoppings/${props.path}/systematic/channels`)
  class ShoppingSystematicChannelsController {
    @core.TypedRoute.Patch()
    public index(
      @props.AuthGuard() _actor: Actor,
      @core.TypedBody() input: IShoppingChannel.IRequest,
    ): Promise<IPage<IShoppingChannel>> {
      return ShoppingChannelProvider.index(input);
    }

    @core.TypedRoute.Patch("hierarchical")
    public async hierarchical(
      @props.AuthGuard() _actor: unknown,
      @core.TypedBody() input: IShoppingChannel.IRequest,
    ): Promise<IPage<IShoppingChannel.IHierarchical>> {
      return ShoppingChannelProvider.hierarchical(input);
    }

    @core.TypedRoute.Get(":id")
    public at(
      @props.AuthGuard() _actor: Actor,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingChannel> {
      return ShoppingChannelProvider.at(id);
    }

    @core.TypedRoute.Get(":code/get")
    public get(
      @props.AuthGuard() _actor: Actor,
      @core.TypedParam("code") code: string,
    ): Promise<IShoppingChannel> {
      return ShoppingChannelProvider.get(code);
    }
  }
  return ShoppingSystematicChannelsController;
}
