import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSystematicSectionsController<
  Actor extends IShoppingActorEntity,
>(props: IShoppingControllerProps) {
  @Controller(`shoppings/${props.path}/systematic/sections`)
  class ShoppingSystematicSectionsController {
    public index(
      @props.AuthGuard() _actor: Actor,
      @core.TypedBody() input: IShoppingSection.IRequest,
    ): Promise<IPage<IShoppingSection>> {
      input;
      return null!;
    }

    @core.TypedRoute.Get(":id")
    public at(
      @props.AuthGuard() _actor: Actor,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingSection> {
      id;
      return null!;
    }

    @core.TypedRoute.Get(":code/get")
    public get(
      @props.AuthGuard() _actor: Actor,
      @core.TypedParam("code") code: string,
    ): Promise<IShoppingSection> {
      code;
      return null!;
    }
  }
  return ShoppingSystematicSectionsController;
}
