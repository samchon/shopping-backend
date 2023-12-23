import core from "@nestia/core";
import { tags } from "typia";

import { IRecordMerge } from "@samchon/shopping-api/lib/structures/common/IRecordMerge";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { ShoppingChannelProvider } from "../../../../providers/shoppings/systematic/ShoppingChannelProvider";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSystematicChannelsController } from "../../base/systematic/ShoppingSystematicChannelsController";

export class ShoppingAdminSystematicChannelsController extends ShoppingSystematicChannelsController(
  {
    AuthGuard: ShoppingAdminAuth,
    path: "admins",
  },
) {
  @core.TypedRoute.Post()
  public async create(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingChannel.ICreate,
  ): Promise<IShoppingChannel> {
    return ShoppingChannelProvider.create(input);
  }

  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingChannel.IUpdate,
  ): Promise<void> {
    return ShoppingChannelProvider.update(id)(input);
  }

  @core.TypedRoute.Delete("merge")
  public async merge(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IRecordMerge,
  ): Promise<void> {
    return ShoppingChannelProvider.merge(input);
  }
}
