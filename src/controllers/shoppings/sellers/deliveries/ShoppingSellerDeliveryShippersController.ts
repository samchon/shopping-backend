import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDeliveryShipper } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryShipper";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";

@Controller("shoppings/sellers/deliveries/:deliveryId/shippers")
export class ShoppingSellerDeliveryShippersController {
  @core.TypedRoute.Post()
  public async create(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("deliveryId") deliveryId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingDeliveryShipper.ICreate,
  ): Promise<IShoppingDeliveryShipper> {
    seller;
    deliveryId;
    input;
    return null!;
  }
}
