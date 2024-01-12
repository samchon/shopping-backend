import core from "@nestia/core";
import { tags } from "typia";

import { IRecordMerge } from "@samchon/shopping-api/lib/structures/common/IRecordMerge";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { ShoppingChannelProvider } from "../../../../providers/shoppings/systematic/ShoppingChannelProvider";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSystematicChannelController } from "../../base/systematic/ShoppingSystematicChannelController";

export class ShoppingAdminSystematicChannelController extends ShoppingSystematicChannelController(
  {
    AuthGuard: ShoppingAdminAuth,
    path: "admins",
  },
) {
  /**
   * Create a new channel.
   *
   * Create a new {@link IShoppingChannel channel} with given code and name.
   *
   * As channel means an individual market,
   * {@link IShoppingAdministrator administrator} should perform this action
   * only when a new application being registered.
   *
   * @param input Creation info of the channel
   * @returns Newly created channel
   * @tag Systematic
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingChannel.ICreate,
  ): Promise<IShoppingChannel> {
    return ShoppingChannelProvider.create(input);
  }

  /**
   * Update a channel.
   *
   * Update a {@link IShoppingChannel channel}'s name.
   *
   * Note that, it is not possible to change the channel's code. If you want to
   * to do it forcibly, then {@link create} new one and {@link merge} with it.
   *
   * @param id Target channel's {@link IShoppingChannel.code}
   * @param input Update info of the channel
   * @tag Systematic
   *
   * @author Samchon
   */
  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingChannel.IUpdate,
  ): Promise<void> {
    return ShoppingChannelProvider.update(id)(input);
  }

  /**
   * Merge multiple channels into one.
   *
   * In this shopping mall system, it is not possible to delete a
   * {@link IShoppingChannel channel}, because it is a systematic entity
   * affecting to all other core entities like customers, members and
   * sales. Instead of deleting, you can merge multiple channels into one.
   *
   * If you specify a channel to absorb others, then all of other channels
   * will be merged into the specified one. Also, subsidiary entities of
   * channels also be merged and their references also be merged cascadingly.
   *
   * @param input Request info of the merge
   * @tag Systematic
   *
   * @author Samchon
   */
  @core.TypedRoute.Delete("merge")
  public async merge(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IRecordMerge,
  ): Promise<void> {
    return ShoppingChannelProvider.merge(input);
  }
}
