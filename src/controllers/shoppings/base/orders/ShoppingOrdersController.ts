import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";

import { ShoppingOrderProvider } from "../../../../providers/shoppings/orders/ShoppingOrderProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingOrdersController<Actor extends IShoppingActorEntity>(
  props: IShoppingControllerProps,
) {
  @Controller(`shoppings/${props.path}/orders`)
  abstract class ShoppingOrdersController {
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() actor: Actor,
      @core.TypedBody() input: IShoppingOrder.IRequest,
    ): Promise<IPage<IShoppingOrder>> {
      return ShoppingOrderProvider.index(actor)(input);
    }

    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingOrder> {
      return ShoppingOrderProvider.at(actor)(id);
    }
  }
  return ShoppingOrdersController;
}
