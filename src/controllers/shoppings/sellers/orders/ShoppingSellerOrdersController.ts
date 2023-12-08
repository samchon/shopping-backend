import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDeliveryPiece } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryPiece";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingOrdersController } from "../../base/orders/ShoppingOrdersController";

export class ShoppingSellerOrdersController extends ShoppingOrdersController({
  path: "sellers",
  AuthGuard: ShoppingSellerAuth,
}) {
  @core.TypedRoute.Get(":id/incompletes")
  public async incompletes(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingDeliveryPiece.ICreate[]> {
    seller;
    id;
    return null!;
  }
}
