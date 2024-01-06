import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ShoppingSaleQuestionProvider } from "../../../../providers/shoppings/sales/inquiries/ShoppingSaleSnapshotQuestionProvider";

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
      return ShoppingSaleQuestionProvider.index(actor)({ id: saleId })(input);
    }

    @core.TypedRoute.Patch("abridges")
    public async abridges(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedBody() input: IShoppingSaleQuestion.IRequest,
    ): Promise<IPage<IShoppingSaleQuestion.IAbridge>> {
      return ShoppingSaleQuestionProvider.abridges(actor)({ id: saleId })(
        input,
      );
    }

    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingSaleQuestion> {
      return ShoppingSaleQuestionProvider.at(actor)({ id: saleId })(id);
    }
  }
  return ShoppingSaleQuestionsController;
}
