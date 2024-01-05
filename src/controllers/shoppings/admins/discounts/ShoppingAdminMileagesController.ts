import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingMileage } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileage";

import { ShoppingMileageProvider } from "../../../../providers/shoppings/mileages/ShoppingMileageProvider";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";

@Controller(`shoppings/admins/mileages`)
export class ShoppingAdminMileagesController {
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IPage.IRequest,
  ): Promise<IPage<IShoppingMileage>> {
    return ShoppingMileageProvider.index(input);
  }

  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingMileage> {
    return ShoppingMileageProvider.at(id);
  }

  @core.TypedRoute.Get(":code/get")
  public async get(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("code") code: string,
  ): Promise<IShoppingMileage> {
    return ShoppingMileageProvider.get(code);
  }

  @core.TypedRoute.Post()
  public async create(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingMileage.ICreate,
  ): Promise<IShoppingMileage> {
    return ShoppingMileageProvider.create(admin)(input);
  }

  @core.TypedRoute.Delete(":id")
  public async erase(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingMileageProvider.erase(admin)(id);
  }
}
