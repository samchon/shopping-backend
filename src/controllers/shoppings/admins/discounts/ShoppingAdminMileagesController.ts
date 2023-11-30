import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingMileage } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileage";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";

@Controller(`shoppings/admins/mileages`)
export class ShoppingAdminMileagesController {
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IPage.IRequest,
  ): Promise<IPage<IShoppingMileage>> {
    admin;
    input;
    return null!;
  }

  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingMileage> {
    admin;
    id;
    return null!;
  }

  @core.TypedRoute.Post()
  public async create(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingMileage.ICreate,
  ): Promise<IShoppingMileage> {
    admin;
    input;
    return null!;
  }

  @core.TypedRoute.Delete(":id")
  public async erase(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    admin;
    id;
  }
}
