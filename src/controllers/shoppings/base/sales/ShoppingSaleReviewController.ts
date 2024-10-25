import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSaleReview } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleReview";

import { ShoppingSaleReviewProvider } from "../../../../providers/shoppings/sales/inquiries/ShoppingSaleSnapshotReviewProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSaleReviewController<
  Actor extends IShoppingActorEntity,
>(props: IShoppingControllerProps) {
  @Controller(`shoppings/${props.path}/sales/:saleId/reviews`)
  abstract class ShoppingSaleReviewController {
    /**
     * List up every summarized reviews.
     *
     * List up every {@link IShoppingSaleReview.ISummary summarized reviews} of a
     * {@link IShoppingSale sale}.
     *
     * As you can see, returned reviews are summarized, not detailed. If you want
     * to get the detailed information of a review, use {@link adridges} function
     * or {@link at} function for each article.
     *
     * Also, returned review has {@link IShoppingSaleReview.ISummary.answer}
     * property which means the formal answer from the {@link IShoppingSeller}.
     *
     * For reference, if you're a {@link IShoppingSeller seller}, you can only
     * access to the your own {@link IShoppingSale sale}'s reviews. Otherwise,
     * you can access to every reviews of the sales.
     *
     * By the way, if you want, you can limit the result by configuring
     * {@link IShoppingSaleReview.IRequest.search search condition} in the
     * request body. Also, it is possible to customize sequence order of records
     * by configuring {@link IShoppingSaleReview.IRequest.sort sort condition}.
     *
     * @param saleId Belonged sale's {@link IShoppingSale.id}
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated reviews with summarized information
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedBody() input: IShoppingSaleReview.IRequest
    ): Promise<IPage<IShoppingSaleReview.ISummary>> {
      return ShoppingSaleReviewProvider.index({
        actor,
        sale: { id: saleId },
        input,
      });
    }

    /**
     * List up every abridged reviews.
     *
     * List up every {@link IShoppingSaleReview.IAbridge abridged reviews} of
     * a {@link IShoppingSale sale}.
     *
     * As you can see, returned reviews are abridged, not detailed. If you want
     * to get the detailed information of a review, use {@link at} function
     * for each article.
     *
     * Also, returned review has {@link IShoppingSaleReview.IAridge.answer}
     * property which means the formal answer from the {@link IShoppingSeller}.
     *
     * For reference, if you're a {@link IShoppingSeller seller}, you can only
     * access to the your own {@link IShoppingSale sale}'s reviews. Otherwise,
     * you can access to every reviews of the sales.
     *
     * By the way, if you want, you can limit the result by configuring
     * {@link IShoppingSaleReview.IRequest.search search condition} in the
     * request body. Also, it is possible to customize sequence order of records
     * by configuring {@link IShoppingSaleReview.IRequest.sort sort condition}.
     *
     * @param saleId Belonged sale's {@link IShoppingSale.id}
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated reviews with abridged information
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Patch("abridges")
    public async abridges(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedBody() input: IShoppingSaleReview.IRequest
    ): Promise<IPage<IShoppingSaleReview.IAbridge>> {
      return ShoppingSaleReviewProvider.abridges({
        actor,
        sale: { id: saleId },
        input,
      });
    }

    /**
     * Get a review info.
     *
     * Get a detailed {@link IShoppingSaleReview review} information of a
     * {@link IShoppingSale sale}.
     *
     * For reference, if you're a {@link IShoppingSeller seller}, you can only
     * access to the your own {@link IShoppingSale sale}'s review. Otherwise
     * you are a {@link IShoppingCustomer customer}, you can access to every
     * reviews of the sales.
     *
     * @param saleId Belonged sale's {@link IShoppingSale.id}
     * @param id Target review's {@link IShoppingSaleReview.id}
     * @returns Detailed review info
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("id") id: string & tags.Format<"uuid">
    ): Promise<IShoppingSaleReview> {
      return ShoppingSaleReviewProvider.at({
        actor,
        sale: { id: saleId },
        id,
      });
    }
  }
  return ShoppingSaleReviewController;
}
