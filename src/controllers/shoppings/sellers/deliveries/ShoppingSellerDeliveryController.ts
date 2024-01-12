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
export class ShoppingSellerDeliveryController {
  /**
   * Get list of deliveries.
   *
   * Get list of {@link IShoppingDelivery.IInvert deliveries} of current
   * {@link IShoppingSeller seller} with {@link IPage pagination}.
   *
   * For reference, returned deliveries are containing the target
   * {@link IShoppingOrder.IInvertFromDelivery order} informations. Of course,
   * only related {@link IShoppingOrderGood goods} are contained in the orders.
   *
   * Additionally, you can limit the result by configuring
   * {@link IShoppingDelivery.IRequest.search search condition} in the request
   * body. Also, it is possible to customize sequence order of records by
   * configuring {@link IShoppingDelivery.IRequest.sort sort condition}.
   *
   * @param input Request info of pagination, searching and sorting
   * @returns Paginated deliveries
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedBody() input: IShoppingDelivery.IRequest,
  ): Promise<IPage<IShoppingDelivery.IInvert>> {
    return ShoppingDeliveryProvider.index(seller)(input);
  }

  /**
   * Get a delivery.
   *
   * Get a {@link IShoppingDelivery.IInvert delivery} information with its ID.
   *
   * For reference, returned delivery is containing the target
   * {@link IShoppingOrder.IInvertFromDelivery order} informations. Of course,
   * only related {@link IShoppingOrderGood goods} are contained in the orders.
   *
   * @param id Target delivery's {@link IShoppingDelivery.id}
   * @returns Delivery info with target orders
   */
  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingDelivery.IInvert> {
    return ShoppingDeliveryProvider.at(seller)(id);
  }

  /**
   * Create a delivery.
   *
   * Create a {@link IShoppingDelivery delivery} record targetting
   * {@link IShoppingOrder orders}, their {@link IShoppingOrderGood goods} and
   * {@link IShoppingSaleUnitStock stocks} ({@link IShoppingDeliveryPiece}) with
   * {@link IShoppingDeliveryJourney journeys} and
   * {@link IShoppingDeliveryShipper shippers} info.
   *
   * Note that, composition of the {@link IShoppingDeliveryPiece} must not over
   * the required. To identify which pieces are required, recommend to call
   * the {@link incompletes} function with target orders'
   * {@link IShoppingOrderPublish.id}s before calling this one.
   *
   * @param input Creation info of delivery
   * @returns Newly created delivery
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedBody() input: IShoppingDelivery.ICreate,
  ): Promise<IShoppingDelivery> {
    return ShoppingDeliveryProvider.create(seller)(input);
  }

  /**
   * Get list of incomplete pieces.
   *
   * Get list of {@link IShoppingDeliveryPiece incomplete pieces} of target
   * orders' {@link IShoppingOrderPublish.id}s.
   *
   * If you specify target orders' publish IDs, then this function returns
   * incompleted pieces of the orders with computation as an Array of
   * {@link IShoppingDeliveryPiece.ICreate} type.
   *
   * You can utillize the result to make a huge {@link IShoppingDelivery delivery}
   * for integrated delivering, and also possible to make multiple deliveries for
   * splitted delivering.
   *
   * @param input List of target orders' {@link IShoppingOrderPublish.id}s
   * @returns List of incomplete pieces
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Patch("incompletes")
  public async incompletes(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedBody() input: IShoppingDeliveryPiece.IRequest,
  ): Promise<IShoppingDeliveryPiece.ICreate[]> {
    return ShoppingDeliveryPieceProvider.incompletes(seller)(input);
  }
}
