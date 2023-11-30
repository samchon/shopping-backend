import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";
import { tags } from "typia";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSaleQuestionsController<
    Actor extends IShoppingActorEntity,
>(props: IShoppingControllerProps) {
    @Controller(`shoppings/${props.path}/sales/:saleId/questions`)
    abstract class ShoppingSaleQuestionsController {
        @core.TypedRoute.Patch()
        public async index(
            @props.AuthGuard() actor: Actor,
            @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
            @core.TypedBody() input: IShoppingSaleQuestion.IRequest,
        ): Promise<IPage<IShoppingSaleQuestion.ISummary>> {
            actor;
            saleId;
            input;
            return null!;
        }

        @core.TypedRoute.Patch("abridges")
        public async abridges(
            @props.AuthGuard() actor: Actor,
            @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
            @core.TypedBody() input: IShoppingSaleQuestion.IRequest,
        ): Promise<IPage<IShoppingSaleQuestion.IAbridge>> {
            actor;
            saleId;
            input;
            return null!;
        }

        @core.TypedRoute.Get(":id")
        public async at(
            @props.AuthGuard() actor: Actor,
            @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
            @core.TypedParam("id") id: string & tags.Format<"uuid">,
        ): Promise<IShoppingSaleQuestion> {
            actor;
            saleId;
            id;
            return null!;
        }
    }
    return ShoppingSaleQuestionsController;
}
