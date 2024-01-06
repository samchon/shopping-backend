import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ShoppingSaleProvider } from "../../../../providers/shoppings/sales/ShoppingSaleProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSalesController<Actor extends IShoppingActorEntity>(
  props: IShoppingControllerProps,
) {
  @Controller(`shoppings/${props.path}/sales`)
  abstract class ShoppingSalesController {
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() actor: Actor,
      @core.TypedBody() input: IShoppingSale.IRequest,
    ): Promise<IPage<IShoppingSale.ISummary>> {
      try {
        return await ShoppingSaleProvider.index(actor)(input);
      } catch (exp) {
        console.log(exp);
        throw exp;
      }
    }

    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingSale> {
      return ShoppingSaleProvider.at(actor)(id);
    }
  }
  return ShoppingSalesController;
}
