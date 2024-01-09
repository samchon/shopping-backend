import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDeliveryJourney } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryJourney";

import { ShoppingDeliveryJourneyProvider } from "../../../../providers/shoppings/deliveries/ShoppingDeliveryJourneyProvider";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";

@Controller("shoppings/sellers/deliveries/:deliveryId/journeys")
export class ShoppingSellerDeliveryJourneysController {
  @core.TypedRoute.Post()
  public async create(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("deliveryId") deliveryId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingDeliveryJourney.ICreate,
  ): Promise<IShoppingDeliveryJourney> {
    return ShoppingDeliveryJourneyProvider.create(seller)({ id: deliveryId })(
      input,
    );
  }

  @core.TypedRoute.Put(":id/complete")
  public async complete(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("deliveryId") deliveryId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingDeliveryJourney.IComplete,
  ): Promise<void> {
    return ShoppingDeliveryJourneyProvider.complete(seller)({
      id: deliveryId,
    })(id)(input);
  }

  @core.TypedRoute.Delete(":id")
  public async erase(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("deliveryId") deliveryId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingDeliveryJourneyProvider.erase(seller)({
      id: deliveryId,
    })(id);
  }
}
