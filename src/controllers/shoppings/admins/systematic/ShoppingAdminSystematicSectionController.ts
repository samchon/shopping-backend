import core from "@nestia/core";
import { tags } from "typia";

import { IRecordMerge } from "@samchon/shopping-api/lib/structures/common/IRecordMerge";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ShoppingSectionProvider } from "../../../../providers/shoppings/systematic/ShoppingSectionProvider";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSystematicSectionController } from "../../base/systematic/ShoppingSystematicSectionController";

export class ShoppingAdminSystematicSectionController extends ShoppingSystematicSectionController(
  {
    AuthGuard: ShoppingAdminAuth,
    path: "admins",
  }
) {
  /**
   * Create a new section.
   *
   * Create a new {@link IShoppingSection section} with given code and name.
   *
   * As section means a spatial unit of a market that handling different type
   * of products with other section, {@link IShoppingAdministrator administrator}
   * should perform this action only when a new section being required.
   *
   * @param input Creation info of the section
   * @returns Newly created section
   * @tag Systematic
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingSection.ICreate
  ): Promise<IShoppingSection> {
    return ShoppingSectionProvider.create(input);
  }

  /**
   * Update a section.
   *
   * Update a {@link IShoppingSection section}'s name.
   *
   * Note that, it is not possible to change the section's code. If you want to
   * to do it forcibly, then {@link create} new one and {@link merge} with it.
   *
   * @param id Target section's {@link IShoppingSection.code}
   * @param input Update info of the section
   * @tag Systematic
   *
   * @author Samchon
   */
  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSection.IUpdate
  ): Promise<void> {
    return ShoppingSectionProvider.update(id)(input);
  }

  /**
   * Merge multiple sections into one.
   *
   * In this shopping mall system, it is not possible to delete a
   * {@link IShoppingSection section}, because it is a systematic entity
   * affecting to all other core entities like {@link IShoppingSale sales}.
   * Instead of deleting, you can merge multiple sections into one.
   *
   * If you specify a section to absorb others, then all of other sections
   * will be merged into the specified one. Also, subsidiary entities of
   * sections also be merged and their references also be merged cascadingly.
   *
   * @param input input Request info of the merge
   * @tag Systematic
   *
   * @author Samchon
   */
  @core.TypedRoute.Delete("merge")
  public async merge(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IRecordMerge
  ): Promise<void> {
    return ShoppingSectionProvider.merge(input);
  }
}
