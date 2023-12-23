import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ShoppingSectionProvider } from "../../../../providers/shoppings/systematic/ShoppingSectionProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSystematicSectionsController<
  Actor extends IShoppingActorEntity,
>(props: IShoppingControllerProps) {
  @Controller(`shoppings/${props.path}/systematic/sections`)
  class ShoppingSystematicSectionsController {
    @core.TypedRoute.Patch()
    public index(
      @props.AuthGuard() _actor: Actor,
      @core.TypedBody() input: IShoppingSection.IRequest,
    ): Promise<IPage<IShoppingSection>> {
      return ShoppingSectionProvider.index(input);
    }

    @core.TypedRoute.Get(":id")
    public at(
      @props.AuthGuard() _actor: Actor,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingSection> {
      return ShoppingSectionProvider.at(id);
    }

    @core.TypedRoute.Get(":code/get")
    public get(
      @props.AuthGuard() _actor: Actor,
      @core.TypedParam("code") code: string,
    ): Promise<IShoppingSection> {
      return ShoppingSectionProvider.get(code);
    }
  }
  return ShoppingSystematicSectionsController;
}
