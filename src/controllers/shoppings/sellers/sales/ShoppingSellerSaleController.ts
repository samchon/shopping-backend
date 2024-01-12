import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ShoppingSaleProvider } from "../../../../providers/shoppings/sales/ShoppingSaleProvider";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSalesController } from "../../base/sales/ShoppingSalesController";

export class ShoppingSellerSaleController extends ShoppingSalesController({
  path: "sellers",
  AuthGuard: ShoppingSellerAuth,
}) {
  /**
   * Create a sale.
   *
   * {@link IShoppingSeller Seller} creates a new {@link IShoppingSale} for
   * operation.
   *
   * For reference, sale has complicate hierarchical structure that composing
   * with {@link IShoppingSaleUnit units}, {@link IShoppingSaleUnitOption options}
   * and {@link IShoppingSaleUnitStock stocks}. Therefore, I recommend you to
   * read the {@link IShoppingSale} and related DTOs' documents before creating
   * a new sale.
   *
   * ERD (Entity Relationship Diagram) and its description document also would
   * be helpful, too.
   *
   * @param input Creation info of the sale
   * @returns Newly created sale
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedBody() input: IShoppingSale.ICreate,
  ): Promise<IShoppingSale> {
    return ShoppingSaleProvider.create(seller)(input);
  }

  /**
   * Update a sale.
   *
   * Update a {@link IShoppingSale sale} with new information.
   *
   * By the way, the sale actually does not being modified, but just make a new
   * {@link IShoppingSaleSnapshot snapshot} record of the sale. Its 1st purpose
   * is to keeping the integrity of the sale, due to modification of the sale
   * must not affect to the {@link IShoppingOrder orders} that already had been
   * applied to the sale.
   *
   * The 2nd purpose is for the A/B tests. {@link IShoppingSeller Seller} needs
   * to demonstrate operating performance by chaning price, content, and
   * composition of the product. This snapshot concept would be helpful for it.
   *
   * @param id Target sale's {@link IShoppingSale.id}
   * @param input New information of the sale
   * @returns Updated sale with new snapshot
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSale.IUpdate,
  ): Promise<IShoppingSale> {
    return ShoppingSaleProvider.update(seller)(id)(input);
  }

  /**
   * Change opening and closing time of a sale.
   *
   * Update a {@link IShoppingSale sale}'s opening and closing time.
   *
   * By the way, if the sale still be opened or closed, it is not possible to
   * change the opening time. In contrary, if the sale already had been opened
   * but still not closed, it is possible to change the closing time.
   *
   * Of course, if closing time is less than opening time or not,
   * 428 unprocessable entity error would be thrown.
   *
   * @param id Target sale's {@link IShoppingSale.id}
   * @param input New opening and closing time
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Put(":id/open")
  public async open(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSale.IUpdateOpeningTime,
  ): Promise<void> {
    return ShoppingSaleProvider.updateOpeningTime(seller)(id)(input);
  }

  /**
   * Get replica of a sale.
   *
   * Get a {@link IShoppingSale.ICreate} typed info of the target sale for
   * replication.
   *
   * It would be useful for creating a new replication
   * {@link IShoppingSale sale} with similar innformatiopn.
   *
   * @param id Target sale's {@link IShoppingSale.id}
   * @returns Creation info of the sale for replication
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Post(":id/replica")
  public async replica(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingSale.ICreate> {
    return ShoppingSaleProvider.replica(seller)(id);
  }

  /**
   * Pause a sale.
   *
   * Pause a {@link IShoppingSale sale} from {@link open opened} state.
   * Therefore, the sale can not be operated again until it be
   * {@link restore restored}. By the way, {@link IShoppingCustomer customer}
   * still can sale from the {@link index} and {@link at} API endpints, but
   * "paused" label would be attached.
   *
   * Also, customer no more can put into the shopping cart, either.
   * Even the sale already had been put into the shopping cart, the
   * {@link IShoppingCartCommodity commodity} will not be listed on the
   * shopping cart. Also, it is not possible to appling an
   * {@link IShoppingOrder order} with the paused sale's commodity, either.
   *
   * By the way, if the sale already had been applied to an order, the order
   * can be {@link IShoppingOrderPublish published} and
   * {@link IShoppingSeller seller} must {@link IShoppingDelivery deliver} the
   * good to the customer.
   *
   * @param id Target sale's {@link IShoppingSale.id}
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Delete(":id/pause")
  public async pause(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingSaleProvider.pause(seller)(id);
  }

  /**
   * Suspend a sale.
   *
   * Suspend a {@link IShoppingSale sale} from {@link open opened} state.
   * Therefore, the sale can not be operated again until it be
   * {@link restore restored} and {@link IShoppingCustomer customer} cannot
   * see the sale from the {@link index} and {@link at} API.
   *
   * Also, customer no more can put into the shopping cart, either.
   * Even the sale already had been put into the shopping cart, the
   * {@link IShoppingCartCommodity commodity} will not be listed on the
   * shopping cart. Also, it is not possible to appling an
   * {@link IShoppingOrder order} with the suspended sale's commodity, either.
   *
   * By the way, if the sale already had been applied to an order, the order
   * can be {@link IShoppingOrderPublish published} and
   * {@link IShoppingSeller seller} must {@link IShoppingDelivery deliver} the
   * good to the customer.
   *
   * @param id Target sale's {@link IShoppingSale.id}
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Delete(":id/suspend")
  public async suspend(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingSaleProvider.suspend(seller)(id);
  }

  /**
   * Restore a sale
   *
   * Restore a {@link IShoppingSale sale} from {@link pause paused} or
   * {@link suspend suspended} state
   *
   * Therefore the sale can be operated again if its
   * {@link IShoppingSale.closed_at closing time} has not been reached.
   * Also, if a {@link IShoppingCustomer customer} had put the sale into the
   * shopping cart when being paused or suspended, the
   * {@link IShoppingCartCommodity commodity} will be listed again on the
   * shopping cart.
   *
   * @param id Target sale's {@link IShoppingSale.id}
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Put(":id/restore")
  public async restore(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingSaleProvider.restore(seller)(id);
  }
}
