import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingMileageDonation } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageDonation";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";

@Controller(`shoppings/admins/mileages/donations`)
export class ShoppingAdminMileageDonationsController {
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingMileageDonation.IRequest,
  ): Promise<IPage<IShoppingMileageDonation>> {
    admin;
    input;
    return null!;
  }

  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingMileageDonation> {
    admin;
    id;
    return null!;
  }

  @core.TypedRoute.Post()
  public async create(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingMileageDonation.ICreate,
  ): Promise<IShoppingMileageDonation> {
    admin;
    input;
    return null!;
  }
}
