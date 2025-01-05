import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ShoppingSaleProvider } from "../../../../providers/shoppings/sales/ShoppingSaleProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSaleController<Actor extends IShoppingActorEntity>(
  props: IShoppingControllerProps
) {
  @Controller(`shoppings/${props.path}/sales`)
  abstract class ShoppingSaleController {
    /**
     * List up every summarized sales.
     *
     * List up every {@link IShoppingSale.ISummary summarized sales}.
     *
     * As you can see, returned sales are summarized, not detailed. If you want
     * to get the detailed information of a sale, use {@link at} function for
     * each sale.
     *
     * For reference, if you're a {@link IShoppingSeller seller}, you can only
     * access to the your own {@link IShoppingSale sale}s. Otherwise you're a
     * {@link IShoppingCustomer customer}, you can see only the operating
     * sales in the market. Instead, you can't see the unopened, closed, or
     * suspended sales.
     *
     * By the way, if you want, you can limit the result by configuring
     * {@link IShoppingSale.IRequest.search search condition} in the request
     * body. Also, it is possible to customize sequence order of records by
     * configuring {@link IShoppingSale.IRequest.sort sort condition}.
     *
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated sales with summarized information
     * @tag Sale
     *
     * @author Samchon
     */
    @core.HumanRoute()
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() actor: Actor,
      @core.TypedBody() input: IShoppingSale.IRequest
    ): Promise<IPage<IShoppingSale.ISummary>> {
      return ShoppingSaleProvider.index({
        actor,
        input,
      });
    }

    /**
     * List up every sales.
     *
     * List up every {@link IShoppingSale sales} with detailed informations.
     *
     * As you can see, returned sales are detailed, not summarized. If you want
     * to get the summarized information of sale for a brief, use {@link index}
     * function instead.
     *
     * For reference, if you're a {@link IShoppingSeller seller}, you can only
     * acess to the your own {@link IShoppingSale sale}s. Otherwise you're a
     * {@link IShoppingCustomer customer}, you can see only the operating sales
     * in the market. Instead, you can't see the unopened, closed, or suspended
     * sales.
     *
     * By the way, if you want, you can limit the result by configuring
     * {@link IShoppingSale.IRequest.search search condition} in the request
     * body. Also, it is possible to customize sequence order of records by
     * configuring {@link IShoppingSale.IRequest.sort sort condition}.
     *
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated sales with detailed information
     * @tag Sale
     *
     * @author Samchon
     */
    public async details(
      @props.AuthGuard() actor: Actor,
      @core.TypedBody() input: IShoppingSale.IRequest
    ): Promise<IPage<IShoppingSale>> {
      return ShoppingSaleProvider.details({
        actor,
        input,
      });
    }

    /**
     * Get a sale info.
     *
     * Get a {@link IShoppingSale sale} with detailed information.
     *
     * If you're a {@link IShoppingSeller seller}, you can only access to the
     * your own {@link IShoppingSale sale}. Otherwise you're a
     * {@link IShoppingCustomer customer}, you can access to only the operating
     * sales in the market. You can't access to the unopened, closed, or suspended
     * sales.
     *
     * @param id Target sale's {@link IShoppingSale.id}
     * @returns Detailed sale information
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("id") id: string & tags.Format<"uuid">
    ): Promise<IShoppingSale> {
      return ShoppingSaleProvider.at({
        actor,
        id,
      });
    }
  }
  return ShoppingSaleController;
}
