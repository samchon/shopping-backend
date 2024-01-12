import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDeliveryShipper } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryShipper";

import { ShoppingDeliveryShipperProvider } from "../../../../providers/shoppings/deliveries/ShoppingDeliveryShipperProvider";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";

@Controller("shoppings/sellers/deliveries/:deliveryId/shippers")
export class ShoppingSellerDeliveryShipperController {
  /**
   * Create a new shipper.
   *
   * Create a new {@link IShoppingDeliveryShipper shipper} of the
   * {@link IShoppingDelivery delivery}.
   *
   * This action does not affect to the related {@link IShoppingOrder orders} or
   * {@link IShoppingOrderGood goods} like {@link IShoppingDeliveryJourney}
   * or {@link IShoppingDeliveryPiece} case, but just informs to the
   * {@link IShoppingCustomer customer}.
   *
   * @param deliveryId Belonged delivery's {@link IShoppingDelivery.id}
   * @param input Creation info of the shipper
   * @returns Newly created shipper
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("deliveryId") deliveryId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingDeliveryShipper.ICreate,
  ): Promise<IShoppingDeliveryShipper> {
    return ShoppingDeliveryShipperProvider.create(seller)({ id: deliveryId })(
      input,
    );
  }
}
