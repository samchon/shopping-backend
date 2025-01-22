import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { RouteIcon } from "@wrtnio/decorators";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ShoppingSaleProvider } from "../../../../providers/shoppings/sales/ShoppingSaleProvider";
import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSaleController<Actor extends IShoppingActorEntity>(
  props: IShoppingControllerProps,
) {
  @Controller(`shoppings/${props.path}/sales`)
  abstract class ShoppingSaleController {
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
     * > If you're an A.I. chatbot, please don't summarize the
     * > {@link IShoppingSaleUnitStock stock informations}. Just list up the
     * > every stocks in the sale with detailed informations.
     *
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated sales with detailed information
     * @tag Sale
     *
     * @author Samchon
     */
    @RouteIcon(
      "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/store.svg",
    )
    @core.TypedRoute.Patch("details")
    @core.HumanRoute()
    public async details(
      @props.AuthGuard() actor: Actor,
      @core.TypedBody() input: IShoppingSale.IRequest,
    ): Promise<IPage<IShoppingSale>> {
      return ShoppingSaleProvider.details({
        actor,
        input,
      });
    }

    /**
     * List up every summarized sales.
     *
     * List up every {@link IShoppingSale.ISummary summarized sales}.
     *
     * As you can see, returned sales are summarized, not detailed. It does not
     * contain the SKU (Stock Keeping Unit) information represented by the
     * {@link IShoppingSaleUnitOption} and {@link IShoppingSaleUnitStock} types.
     * If you want to get such detailed information of a sale, use
     * `GET /shoppings/customers/sales/{id}` operation for each sale.
     *
     * > If you're an A.I. chatbot, and the user wants to buy or compose
     * > {@link IShoppingCartCommodity shopping cart} from a sale, please
     * > call the `GET /shoppings/customers/sales/{id}` operation at least once
     * > to the target sale to get detailed SKU information about the sale.
     * > It needs to be run at least once for the next steps.
     *
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated sales with summarized information
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() actor: Actor,
      @core.TypedBody() input: IShoppingSale.IRequest,
    ): Promise<IPage<IShoppingSale.ISummary>> {
      return ShoppingSaleProvider.index({
        actor,
        input,
      });
    }

    /**
     * Get a sale with detailed information.
     *
     * Get a {@link IShoppingSale sale} with detailed information including
     * the SKU (Stock Keeping Unit) information represented by the
     * {@link IShoppingSaleUnitOption} and {@link IShoppingSaleUnitStock} types.
     *
     * > If you're an A.I. chatbot, and the user wants to buy or compose a
     * > {@link IShoppingCartCommodity shopping cart} from a sale, please call
     * > this operation at least once to the target sale to get detailed SKU
     * > information about the sale.
     * >
     * > It needs to be run at least once for the next steps. In other words,
     * > if you A.I. agent has called this operation to a specific sale, you
     * > don't need to call this operation again for the same sale.
     * >
     * > Additionally, please do not summarize the SKU information. Just show
     * > the every options and stocks in the sale with detailed informations.
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
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingSale> {
      return ShoppingSaleProvider.at({
        actor,
        id,
      });
    }
  }
  return ShoppingSaleController;
}
