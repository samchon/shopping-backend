import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingDeposit } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDeposit";

import { ShoppingDepositProvider } from "../../../../providers/shoppings/deposits/ShoppingDepositProvider";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";

@Controller(`shoppings/admins/deposits`)
export class ShoppingAdminDepositsController {
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IPage.IRequest,
  ): Promise<IPage<IShoppingDeposit>> {
    return ShoppingDepositProvider.index(input);
  }

  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingDeposit> {
    return ShoppingDepositProvider.at(id);
  }

  @core.TypedRoute.Post()
  public async create(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingDeposit.ICreate,
  ): Promise<IShoppingDeposit> {
    return ShoppingDepositProvider.create(admin)(input);
  }

  @core.TypedRoute.Delete(":id")
  public async erase(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingDepositProvider.erase(admin)(id);
  }
}
