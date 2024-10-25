import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDeliveryJourney } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryJourney";

import { ShoppingDeliveryJourneyProvider } from "../../../../providers/shoppings/deliveries/ShoppingDeliveryJourneyProvider";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";

@Controller("shoppings/sellers/deliveries/:deliveryId/journeys")
export class ShoppingSellerDeliveryJourneyController {
  /**
   * Create a new journey.
   *
   * Create a new {@link IShoppingDeliveryJourney journey} of the
   * {@link IShoppingDelivery delivery}.
   *
   * This action may change the related {@link IShoppingOrderGood.state}.
   * Also, if the target journey's type is "delivering", whether the property
   * {@link IShoppingDeliveryJourney.completed_at} is null or not affects to
   * the related goods' states. If the property is not null, the state becomes
   * "arrived". Otherwise, the state becomes "delivering".
   *
   * @param deliveryId Belonged delivery's {@link IShoppingDelivery.id}
   * @param input Creation info of the journey
   * @returns Newly created journey
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public create(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("deliveryId") deliveryId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingDeliveryJourney.ICreate
  ): Promise<IShoppingDeliveryJourney> {
    return ShoppingDeliveryJourneyProvider.create({
      seller,
      delivery: { id: deliveryId },
      input,
    });
  }

  /**
   * Complete a journey.
   *
   * Complete a {@link IShoppingDeliveryJourney journey} of the
   * {@link IShoppingDelivery delivery}. In other words, fills the
   * {@link IShoppingDeliveryJourney.completed_at} property with current time.
   *
   * If the target journey's type is "delivering", this action may change
   * the related {@link IShoppingOrderGood.state goods' states} to be "arrived".
   *
   * @param deliveryId Belonged delivery's {@link IShoppingDelivery.id}
   * @param id Target journey's {@link IShoppingDeliveryJourney.id}
   * @param input Completion time of the journey
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Put(":id/complete")
  public complete(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("deliveryId") deliveryId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingDeliveryJourney.IComplete
  ): Promise<void> {
    return ShoppingDeliveryJourneyProvider.complete({
      seller,
      delivery: { id: deliveryId },
      id,
      input,
    });
  }

  /**
   * Erase a journey.
   *
   * Erase a {@link IShoppingDeliveryJourney journey} of the
   * {@link IShoppingDelivery delivery}.
   *
   * If erasing journey is the last one of the belonged delivery, this action
   * may change the related {@link IShoppingOrderGood.state}. By erasing the last
   * journey, the state rolls back to the previous.
   *
   * @param deliveryId Belonged delivery's {@link IShoppingDelivery.id}
   * @param id Target journey's {@link IShoppingDeliveryJourney.id}
   * @returns Newly created journey
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Delete(":id")
  public erase(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("deliveryId") deliveryId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">
  ): Promise<void> {
    return ShoppingDeliveryJourneyProvider.erase({
      seller,
      delivery: { id: deliveryId },
      id,
    });
  }
}
