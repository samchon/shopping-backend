import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDelivery } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDelivery";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";

@Controller("shoppings/sellers/deliveries")
export class ShoppingSellerDeliveriesController {
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedBody() input: IShoppingDelivery.IRequest,
  ): Promise<IPage<IShoppingDelivery.IInvert>> {
    seller;
    input;
    return null!;
  }

  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingDelivery.IInvert> {
    seller;
    id;
    return null!;
  }

  @core.TypedRoute.Post()
  public async create(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedBody() input: IShoppingDelivery.ICreate,
  ): Promise<IShoppingDelivery> {
    seller;
    input;
    return null!;
  }
}
