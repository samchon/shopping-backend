import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDelivery } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDelivery";
import { IShoppingDeliveryPiece } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryPiece";

import { ShoppingDeliveryPieceProvider } from "../../../../providers/shoppings/deliveries/ShoppingDeliveryPieceProvider";
import { ShoppingDeliveryProvider } from "../../../../providers/shoppings/deliveries/ShoppingDeliveryProvider";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";

@Controller("shoppings/sellers/deliveries")
export class ShoppingSellerDeliveriesController {
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedBody() input: IShoppingDelivery.IRequest,
  ): Promise<IPage<IShoppingDelivery.IInvert>> {
    return ShoppingDeliveryProvider.index(seller)(input);
  }

  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingDelivery.IInvert> {
    return ShoppingDeliveryProvider.at(seller)(id);
  }

  @core.TypedRoute.Post()
  public async create(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedBody() input: IShoppingDelivery.ICreate,
  ): Promise<IShoppingDelivery> {
    return ShoppingDeliveryProvider.create(seller)(input);
  }

  @core.TypedRoute.Patch("incompletes")
  public async incompletes(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedBody() input: IShoppingDeliveryPiece.IRequest,
  ): Promise<IShoppingDeliveryPiece.ICreate[]> {
    return ShoppingDeliveryPieceProvider.incompletes(seller)(input);
  }
}
