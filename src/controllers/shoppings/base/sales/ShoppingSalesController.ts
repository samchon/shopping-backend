import nest from "@modules/nestjs";
import core from "@nestia/core";
import { tags } from "typia";

import { IPage } from "samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSale } from "samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSalesController<Actor extends IShoppingActorEntity>(
    props: IShoppingControllerProps,
) {
    @nest.Controller(`shoppings/${props.path}/sales`)
    abstract class ShoppingSalesController {
        @core.TypedRoute.Patch()
        public async index(
            @props.AuthGuard() actor: Actor,
            @core.TypedBody() input: IShoppingSale.IRequest,
        ): Promise<IPage<IShoppingSale.ISummary>> {
            actor;
            input;
            return null!;
        }

        @core.TypedRoute.Get(":id")
        public async at(
            @props.AuthGuard() actor: Actor,
            @core.TypedParam("id") id: string & tags.Format<"uuid">,
        ): Promise<IShoppingSale.ISummary> {
            actor;
            id;
            return null!;
        }
    }
    return ShoppingSalesController;
}
