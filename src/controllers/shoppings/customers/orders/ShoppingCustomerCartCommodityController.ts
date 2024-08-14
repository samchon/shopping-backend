import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingCartDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartDiscountable";

import { ShoppingCartCommodityProvider } from "../../../../providers/shoppings/orders/ShoppingCartCommodityProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/carts/:cartId/commodities`)
export class ShoppingCustomerCartCommodityController {
  /**
   * List of every commodities.
   *
   * List up every {@link IShoppingCartCommodity commodities} in the
   * shopping cart with {@link IPage pagination}.
   *
   * If the *cartId* is not specified but `null` value assigned, then every
   * cart would be targetted. Also, you can limit the result by configuring
   * {@link IShoppingCartCommodity.IRequest.search search condition} in the
   * request body. Furthermore, it is possible to customize sequence order of
   * records by configuring {@link IShoppingCartCommodity.IRequest.sort}.
   *
   * For reference, when some commodity be {@link IShoppingOrder ordered} and
   * {@link IShoppingOrderPublish published}, then it would not be appread in
   * the shopping cart more. Otherwise, the order has not been published yet,
   * it would be appread in the shopping cart and still enable to create a new
   * {@link IShoppingOrder order application} with the same commodity.
   *
   * Of course, if the target {@link IShoppingSale sale} has been suspended, or
   * {@link IShoppingSaleUnitStockInventory out of stock}, then it would not be
   * appread in the shopping cart more, either.
   *
   * @param cartId Belonged cart's ID
   * @param input Request info of pagination, searching and sorting
   * @returns Paginated commodities
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedBody() input: IShoppingCartCommodity.IRequest,
  ): Promise<IPage<IShoppingCartCommodity>> {
    return ShoppingCartCommodityProvider.index(customer)(
      cartId ? { id: cartId } : null,
    )(input);
  }

  /**
   * Get a commodity.
   *
   * Get a {@link IShoppingCartCommodity commodity} record of the shopping cart.
   *
   * If the *cartId* is different with the belonged cart's ID, then 404 not
   * found exception would be thrown. Otherwise, the *cartId* has `null` value,
   * such dependency checking would be skipped, but still ownership would be
   * validated.
   *
   * Also, if target {@link IShoppingSale sale} has been suspended or
   * {@link IShoppingSaleUnitStockInventory out of stock}, then 410 gone error
   * would be thrown. Therefore, even if you've created a commodity successfully
   * with the {@link create} method, it still can be failed when you access the
   * commodity with this {@link at} method.
   *
   * @param cartId Belonged cart's ID
   * @param id Target commodity's {@link IShoppingCartCommodity.id}
   * @returns Detailed commodity info
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingCartCommodity> {
    return ShoppingCartCommodityProvider.at(customer)(
      cartId ? { id: cartId } : null,
    )(id);
  }

  /**
   * Create a new commodity.
   *
   * Create a new {@link IShoppingCartCommodity commodity} into a specific
   * shopping cart.
   *
   * If {@link IShoppingCartCommodity.ICreate.accumulate} has `true` value
   * and there's some same commodity that composed with same
   * {@link IShoppingSaleUnitStock.IInvert stocks and quantities},
   * then new commodity would not be created but the volume would be accumulated.
   *
   * Also, if the *cartId* is not specified but `null` value assigned, then
   * ordinary cart would be utilized or create new one considering the
   * existence of the previous cart.
   *
   * By the way, if the target {@link IShoppingSale sale} has been suspended or
   * {@link IShoppingSaleUnitStockInventory out of stock}, then 410 gone error
   * would be thrown. Therefore, it would better to check the target sale and
   * {@link IShoppingSaleUnitStock stock}'s status before.
   *
   * @param cartId Belonged cart's ID
   * @param input Creation info of the commodity
   * @returns Newly created commodity
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedBody() input: IShoppingCartCommodity.ICreate,
  ): Promise<IShoppingCartCommodity> {
    return ShoppingCartCommodityProvider.create(customer)(
      cartId ? { id: cartId } : null,
    )(input);
  }

  /**
   * Update a commodity (volume).
   *
   * Update a {@link IShoppingCartCommodity commodity}'s volume in the
   * shopping cart.
   *
   * If the *cartId* is different with the belonged cart's ID, then 404 not
   * found exception would be thrown. Otherwise, the *cartId* has `null` value,
   * such dependency checking would be skipped, but still ownership would be
   * validated.
   *
   * Also, if target {@link IShoppingSale sale} has been suspended or
   * {@link IShoppingSaleUnitStockInventory out of stock} suddenly, then 410
   * gone error would be thrown, either.
   *
   * @param cartId Belonged cart's ID
   * @param id Target commodity's {@link IShoppingCartCommodity.id}
   * @param input Update info of the commodity (volume)
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingCartCommodity.IUpdate,
  ): Promise<void> {
    return ShoppingCartCommodityProvider.update(customer)(
      cartId ? { id: cartId } : null,
    )(id)(input);
  }

  /**
   * Get replica of a commodity.
   *
   * Get a {@link IShoppingCartCommodity.ICreate} typed info of the target
   * commodity for replication.
   *
   * By the way, if the *cartId* is different with the belonged cart's ID,
   * then 404 not found exception would be thrown. Otherwise, the *cartId*
   * has `null` value, such dependency checking would be skipped, but still
   * ownership would be validated.
   *
   * Also, if target {@link IShoppingSale sale} has been suspended or
   * {@link IShoppingSaleUnitStockInventory out of stock} suddenly,
   * then 410 gone error would be thrown, either.
   *
   * @param cartId Belonged cart's ID
   * @param id Target commodity's {@link IShoppingCartCommodity.id}
   * @returns Creation info of the commodity for replication
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Get(":id/replica")
  public async replica(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingCartCommodity.ICreate> {
    return ShoppingCartCommodityProvider.replica(customer)(
      cartId ? { id: cartId } : null,
    )(id);
  }

  /**
   * Erase a commodity.
   *
   * Erase a {@link IShoppingCartCommodity commodity} from the shopping cart.
   *
   * If the commodity is on an {@link IShoppingOrder order} process, it is not
   * possible to erase it. Instead, if the order has been
   * {@link IShoppingOrderPublish published}, then it would not be appread in
   * the shopping cart more. If the order be erased, then you also can continue
   * erasinng the commodity, neither.
   *
   * @param cartId Belonged cart's ID
   * @param id Target commodity's {@link IShoppingCartCommodity.id}
   * @returns Newly created commodity
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Delete(":id")
  public async erase(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingCartCommodityProvider.erase(customer)(
      cartId ? { id: cartId } : null,
    )(id);
  }

  /**
   * Get discountable info.
   *
   * Compute discountable features about the
   *  {@link IShoppingCartCommodity shopping cart} even including
   * non-carted {@link IShoppingSale sales}.
   *
   * Returned {@link IShoppingCartDiscountable} contains including
   * combinations of adjustable {@link IShoppingCoupon coupons},
   * withdrawable {@link IShoppingDepositHistory deposits} and
   * {@link IShoppingMileageHistory mileages}.
   *
   * Also, if you want to know the discountable info about some specific
   * sales that have not been carted yet, specify the sales
   * to the {@link IShoppingCartDiscountable.pseudos} property with composing
   * {@link IShoppingCartCommodity.ICreate creation info of the commodities}.
   * Then, they would be included in the discountable info.
   *
   * @param cartId Belonged cart's ID
   * @param input Request info for discountable
   * @returns Discountable info
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Patch("discountable")
  public async discountable(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedBody() input: IShoppingCartDiscountable.IRequest,
  ): Promise<IShoppingCartDiscountable> {
    return ShoppingCartCommodityProvider.discountable(customer)(
      cartId ? { id: cartId } : null,
    )(input);
  }
}
