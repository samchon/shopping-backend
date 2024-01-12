import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ShoppingSectionProvider } from "../../../../providers/shoppings/systematic/ShoppingSectionProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSystematicSectionController<
  Actor extends IShoppingActorEntity,
>(props: IShoppingControllerProps) {
  @Controller(`shoppings/${props.path}/systematic/sections`)
  class ShoppingSystematicSectionController {
    /**
     * List up every sections.
     *
     * List up every {@link IShoppingSection sections} with pagination.
     *
     * If you want, you can limit the result by configuring
     * {@link IShoppingSection.IRequest.search search condition} in the request
     * body. Also, it is possible to customize sequence order of records by
     * configuring {@link IShoppingSection.IRequest.sort sort condition}.
     *
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated sections
     * @tag Section
     *
     * @author Samchon
     */
    @core.TypedRoute.Patch()
    public index(
      @props.AuthGuard() _actor: Actor,
      @core.TypedBody() input: IShoppingSection.IRequest,
    ): Promise<IPage<IShoppingSection>> {
      return ShoppingSectionProvider.index(input);
    }

    /**
     * Get a section info.
     *
     * Get a detailed {@link IShoppingSection section} information.
     *
     * @param id Target section's {@link IShoppingSection.id}
     * @returns Detailed section info
     * @tag Section
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":id")
    public at(
      @props.AuthGuard() _actor: Actor,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingSection> {
      return ShoppingSectionProvider.at(id);
    }

    /**
     * Get a section info by its code.
     *
     * Get a detailed {@link IShoppingSection section} information by its code.
     *
     * @param code Target section's {@link IShoppingSection.code}
     * @returns Detailed section info
     * @tag Section
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":code/get")
    public get(
      @props.AuthGuard() _actor: Actor,
      @core.TypedParam("code") code: string,
    ): Promise<IShoppingSection> {
      return ShoppingSectionProvider.get(code);
    }
  }
  return ShoppingSystematicSectionController;
}
