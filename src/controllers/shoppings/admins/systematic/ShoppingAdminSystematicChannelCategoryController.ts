import core from "@nestia/core";

import { IRecordMerge } from "@samchon/shopping-api/lib/structures/common/IRecordMerge";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { ShoppingChannelCategoryProvider } from "../../../../providers/shoppings/systematic/ShoppingChannelCategoryProvider";
import { ShoppingChannelProvider } from "../../../../providers/shoppings/systematic/ShoppingChannelProvider";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSystematicChannelCategoryController } from "../../base/systematic/ShoppingSystematicChannelCategoryController";

export class ShoppingAdminSystematicChannelCategoryController extends ShoppingSystematicChannelCategoryController(
  {
    AuthGuard: ShoppingAdminAuth,
    path: "admins",
  }
) {
  /**
   * Create a new category.
   *
   * Create a new {@link IShoppingChannelCategory category} of a
   * {@link IShoppingChannel channel} with given name. If required, it is
   * possible to specify the parent category by its ID.
   *
   * @param channelCode Belonged channel's {@link IShoppingChannel.code}
   * @param input Creation info of the category
   * @returns Newly created category
   * @tag Systematic
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("channelCode") channelCode: string,
    @core.TypedBody() input: IShoppingChannelCategory.ICreate
  ): Promise<IShoppingChannelCategory> {
    return ShoppingChannelCategoryProvider.create({
      channel: await ShoppingChannelProvider.get(channelCode),
      input,
    });
  }

  /**
   * Update a category.
   *
   * Update a {@link IShoppingChannelCategory category}'s name. If required,
   * it is possible to change the parent category by its ID. Of course, detaching
   * from the parent category so that becoming the root category is also possible.
   *
   * @param channelCode Belonged channel's {@link IShoppingChannel.code}
   * @param id Target category's {@link IShoppingChannelCategory.id}
   * @param input Update info of the category
   * @tag Systematic
   *
   * @author Samchon
   */
  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("channelCode") channelCode: string,
    @core.TypedParam("id") id: string,
    @core.TypedBody() input: IShoppingChannelCategory.IUpdate
  ): Promise<void> {
    return ShoppingChannelCategoryProvider.update({
      channel: await ShoppingChannelProvider.get(channelCode),
      id,
      input,
    });
  }

  /**
   * Merge multiple categories into one.
   *
   * In this shopping mall system, it is not possible to delete a
   * {@link IShoppingChannelCategory category}, because it is a systematic
   * entity affecting to all other core entities like
   * {@link IShoppingSale sales}. Instead of deleting, you can merge multiple
   * categories into one.
   *
   * If you specify a category to absorb others, then all of other categories
   * will be merged into the specified one. Also, subsidiary entities of
   * categories also be merged and their references also be merged cascadingly.
   *
   * @param channelCode Belonged channel's {@link IShoppingChannel.code}
   * @param input Merge info of the categories
   * @tag Systematic
   *
   * @author Samchon
   */
  @core.TypedRoute.Delete("merge")
  public async merge(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("channelCode") channelCode: string,
    @core.TypedBody() input: IRecordMerge
  ): Promise<void> {
    return ShoppingChannelCategoryProvider.merge({
      channel: await ShoppingChannelProvider.get(channelCode),
      input,
    });
  }
}
