import core from "@nestia/core";
import { tags } from "typia";

import { IRecordMerge } from "@samchon/shopping-api/lib/structures/common/IRecordMerge";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSystematicSectionsController } from "../../base/systematic/ShoppingSystematicSectionsController";

export class ShoppingAdminSystematicSectionsController extends ShoppingSystematicSectionsController(
  {
    AuthGuard: ShoppingAdminAuth,
    path: "admins",
  },
) {
  @core.TypedRoute.Post()
  public async create(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingSection.ICreate,
  ): Promise<IShoppingSection> {
    input;
    return null!;
  }

  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSection.IUpdate,
  ): Promise<void> {
    id;
    input;
  }

  @core.TypedRoute.Delete("merge")
  public async merge(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IRecordMerge,
  ): Promise<void> {
    input;
  }
}