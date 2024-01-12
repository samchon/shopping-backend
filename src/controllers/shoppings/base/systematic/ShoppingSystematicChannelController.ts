import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { ShoppingChannelProvider } from "../../../../providers/shoppings/systematic/ShoppingChannelProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSystematicChannelController<
  Actor extends IShoppingActorEntity,
>(props: IShoppingControllerProps) {
  @Controller(`shoppings/${props.path}/systematic/channels`)
  class ShoppingSystematicChannelController {
    /**
     * List up every channels.
     *
     * List up every {@link IShoppingChannel channels} with pagination.
     *
     * If you want, you can limit the result by configuring
     * {@link IShoppingChannel.IRequest.search search condition} in the request
     * body. Also, it is possible to customize sequence order of records by
     * configuring {@link IShoppingChannel.IRequest.sort sort condition}.
     *
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated channels
     * @tag Systematic
     *
     * @author Samchon
     */
    @core.TypedRoute.Patch()
    public index(
      @props.AuthGuard() _actor: Actor,
      @core.TypedBody() input: IShoppingChannel.IRequest,
    ): Promise<IPage<IShoppingChannel>> {
      return ShoppingChannelProvider.index(input);
    }
    /**
     * List up every channels with nested categories.
     *
     * List up every {@link IShoppingChannel.IHierarchical channels} with
     * {@link IPage pagination}. Returned channels contain nested hierarchical
     * {@link IShoppingChannelCategory.IHierarchical categories}.
     *
     * If you want, you can limit the result by configuring
     * {@link IShoppingChannel.IRequest.search search condition} in the request
     * body. Also, it is possible to customize sequence order of records by
     * configuring {@link IShoppingChannel.IRequest.sort sort condition}.
     *
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated channels with nested categories
     * @tag Systematic
     *
     * @author Samchon
     */
    @core.TypedRoute.Patch("hierarchical")
    public async hierarchical(
      @props.AuthGuard() _actor: unknown,
      @core.TypedBody() input: IShoppingChannel.IRequest,
    ): Promise<IPage<IShoppingChannel.IHierarchical>> {
      return ShoppingChannelProvider.hierarchical(input);
    }

    /**
     * Get a channel info.
     *
     * Get a detailed {@link IShoppingChannel.IHierarchical channel} information.
     *
     * Returned channel instance also contains the nested
     * {@link IShoppingChannelCategory.IHierarchical hierarchical category}
     * informations.
     *
     * @param id Target channel's {@link IShoppingChannel.id}
     * @returns Detailed channel info
     * @tag Systematic
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":id")
    public at(
      @props.AuthGuard() _actor: Actor,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingChannel.IHierarchical> {
      return ShoppingChannelProvider.at(id);
    }

    /**
     * Get a channel info by its code.
     *
     * Get a detailed {@link IShoppingChannel.IHierarchical channel} information
     * by its code.
     *
     * Returned channel instance also contains the nested
     * {@link IShoppingChannelCategory.IHierarchical hierarchical category}
     * informations.
     *
     * @param code Target channel's {@link IShoppingChannel.code}
     * @returns Detailed channel info
     * @tag Systematic
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":code/get")
    public get(
      @props.AuthGuard() _actor: Actor,
      @core.TypedParam("code") code: string,
    ): Promise<IShoppingChannel.IHierarchical> {
      return ShoppingChannelProvider.get(code);
    }
  }
  return ShoppingSystematicChannelController;
}
