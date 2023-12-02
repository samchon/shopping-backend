import core from "@nestia/core";

import { IRecordMerge } from "@samchon/shopping-api/lib/structures/common/IRecordMerge";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSystematicChannelCategoriesController } from "../../base/systematic/ShoppingSystematicChannelCategoriesController";

export class ShoppingAdminSystematicChannelCategoriesController extends ShoppingSystematicChannelCategoriesController(
  {
    AuthGuard: ShoppingAdminAuth,
    path: "admins",
  },
) {
  @core.TypedRoute.Post()
  public async create(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("channelCode") channelCode: string,
    @core.TypedBody() input: IShoppingChannelCategory.ICreate,
  ): Promise<IShoppingChannelCategory> {
    channelCode;
    input;
    return null!;
  }

  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("channelCode") channelCode: string,
    @core.TypedParam("id") id: string,
    @core.TypedBody() input: IShoppingChannelCategory.IUpdate,
  ): Promise<void> {
    channelCode;
    id;
    input;
  }

  @core.TypedRoute.Delete("merge")
  public async merge(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("channelCode") channelCode: string,
    @core.TypedBody() input: IRecordMerge,
  ): Promise<void> {
    channelCode;
    input;
  }
}
