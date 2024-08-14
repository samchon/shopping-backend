import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";

import { ShoppingOrderProvider } from "../../../../providers/shoppings/orders/ShoppingOrderProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingOrderController<Actor extends IShoppingActorEntity>(
  props: IShoppingControllerProps,
) {
  @Controller(`shoppings/${props.path}/orders`)
  abstract class ShoppingOrderController {
    /**
     * List up every orders.
     *
     * List up every {@link IShoppingOrder orders} with pagination.
     *
     * If you want, you can limit the result by configuring
     * {@link IShoppingOrder.IRequest.search search condition} in the request
     * body. Also, it is possible to customize sequence order of records by
     * configuring {@link IShoppingOrder.IRequest.sort sort condition}.
     *
     * For reference, if you are a {@link IShoppingCustomer customer}, then
     * you can list up your own orders, and it is not a matter whether the
     * order has been {@link IShoppingOrderPublish.paid_at paid} or not.
     *
     * Otherwise you are a {@link IShoppingSeller seller} or
     * {@link IShoppingAdministrator administrator}, then you can list up
     * only paid orders. Also, in the seller case, only related
     * {@link IShoppingOrder.goods goods} would be listed up in the order.
     *
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated orders
     * @tag Order
     *
     * @author Samchon
     */
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() actor: Actor,
      @core.TypedBody() input: IShoppingOrder.IRequest,
    ): Promise<IPage<IShoppingOrder>> {
      return ShoppingOrderProvider.index(actor)(input);
    }

    /**
     * Get an order info.
     *
     * Get a detailed {@link IShoppingOrder order} information.
     *
     * If you are not a {@link IShoppingCustomer customer}, then you can't
     * access to the order which has not been
     * {@link IShoppingOrderPublish.paid_at paid} yet. In that case,
     * 404 not found error would be thrown.
     *
     * @param id Target order's {@link IShoppingOrder.id}
     * @returns Order info
     * @tag Order
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingOrder> {
      return ShoppingOrderProvider.at(actor)(id);
    }
  }
  return ShoppingOrderController;
}
