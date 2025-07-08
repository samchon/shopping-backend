import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ShoppingSaleQuestionProvider } from "../../../../providers/shoppings/sales/inquiries/ShoppingSaleSnapshotQuestionProvider";
import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSaleQuestionController<
  Actor extends IShoppingActorEntity,
>(props: IShoppingControllerProps) {
  @Controller(`shoppings/${props.path}/sales/:saleId/questions`)
  abstract class ShoppingSaleQuestionController {
    /**
     * List up every summarized questions.
     *
     * List up every {@link IShoppingSaleQuestion.ISummary summarized questions} of a
     * {@link IShoppingSale sale}.
     *
     * As you can see, returned questions are summarized, not detailed. If you want
     * to get the detailed information of a question, use {@link adridges} function
     * or {@link at} function for each article.
     *
     * Also, returned question has {@link IShoppingSaleQuestion.ISummary.answer}
     * property which means the formal answer from the {@link IShoppingSeller}.
     * Additionally, returned question has another special property
     * {@link IShoppingSaleQuestion.ISummary.secret} with masking to other
     * principle properties, and it means only related actors can {@link at read}
     * the question.
     *
     * For reference, if you're a {@link IShoppingSeller seller}, you can only
     * access to the your own {@link IShoppingSale sale}'s questions. Otherwise,
     * you can access to every questions of the sales.
     *
     * By the way, if you want, you can limit the result by configuring
     * {@link IShoppingSaleQuestion.IRequest.search search condition} in the
     * request body. Also, it is possible to customize sequence order of records
     * by configuring {@link IShoppingSaleQuestion.IRequest.sort sort condition}.
     *
     * @param saleId Belonged sale's {@link IShoppingSale.id}
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated questions with summarized information
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedBody() input: IShoppingSaleQuestion.IRequest,
    ): Promise<IPage<IShoppingSaleQuestion.ISummary>> {
      return ShoppingSaleQuestionProvider.index({
        actor,
        sale: { id: saleId },
        input,
      });
    }

    /**
     * List up every abridged questions.
     *
     * List up every {@link IShoppingSaleQuestion.IAbridge abridged questions} of
     * a {@link IShoppingSale sale}.
     *
     * As you can see, returned questions are abridged, not detailed. If you want
     * to get the detailed information of a question, use {@link at} function
     * for each article.
     *
     * Also, returned question has {@link IShoppingSaleQuestion.IAridge.answer}
     * property which means the formal answer from the {@link IShoppingSeller}.
     * Additionally, returned question has another special property
     * {@link IShoppingSaleQuestion.IAridge.secret} with masking to other
     * principle properties, and it means only related actors can {@link at read}
     * the question.
     *
     * For reference, if you're a {@link IShoppingSeller seller}, you can only
     * access to the your own {@link IShoppingSale sale}'s questions. Otherwise,
     * you can access to every questions of the sales.
     *
     * By the way, if you want, you can limit the result by configuring
     * {@link IShoppingSaleQuestion.IRequest.search search condition} in the
     * request body. Also, it is possible to customize sequence order of records
     * by configuring {@link IShoppingSaleQuestion.IRequest.sort sort condition}.
     *
     * @param saleId Belonged sale's {@link IShoppingSale.id}
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated questions with abridged information
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Patch("abridges")
    public async abridges(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedBody() input: IShoppingSaleQuestion.IRequest,
    ): Promise<IPage<IShoppingSaleQuestion.IAbridge>> {
      return ShoppingSaleQuestionProvider.abridges({
        actor,
        sale: { id: saleId },
        input,
      });
    }

    /**
     * Get a question info.
     *
     * Get a detailed {@link IShoppingSaleQuestion question} information of a
     * {@link IShoppingSale sale}.
     *
     * For reference, if you're a {@link IShoppingSeller seller}, you can only
     * access to the your own {@link IShoppingSale sale}'s question. Otherwise
     * you are a {@link IShoppingCustomer customer}, you can access to every
     * questions of the sales except the {@link IShoppingSaleQuestion.secret}
     * value is `false`.
     *
     * @param saleId Belonged sale's {@link IShoppingSale.id}
     * @param id Target question's {@link IShoppingSaleQuestion.id}
     * @returns Detailed question info
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingSaleQuestion> {
      return ShoppingSaleQuestionProvider.at({
        actor,
        sale: { id: saleId },
        id,
      });
    }
  }
  return ShoppingSaleQuestionController;
}
