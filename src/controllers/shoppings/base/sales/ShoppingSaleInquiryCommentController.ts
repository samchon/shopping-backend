import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSaleInquiryComment } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryComment";

import { ShoppingSaleSnapshotInquiryCommentProvider } from "../../../../providers/shoppings/sales/inquiries/ShoppinigSaleSnapshotInquiryCommentProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSaleInquiryCommentController<
  Actor extends IShoppingActorEntity,
>(type: "questions" | "reviews", props: IShoppingControllerProps) {
  @Controller(
    `shoppings/${props.path}/sales/:saleId/${type}/:inquiryId/comments`
  )
  abstract class ShoppingSaleInquiryCommentController {
    /**
     * List up every inquiry comments.
     *
     * List up every {@link IShoppingSaleInquiryComment inquiry comments} of a
     * {@link IShoppingSaleQuestion question} or {@link IShoppingSaleReview review}
     * with {@link IPage pagination}.
     *
     * If you want, you can limit the result by configuring
     * {@link IShoppingSaleInquiryComment.IRequest.search search condition} in the
     * request body. Also, it is possible to customize sequence order of records
     * by configuring {@link IShoppingSaleInquiryComment.IRequest.sort sort condition}.
     *
     * By the way, if you're a {@link IShoppingSeller seller}, you can only access
     * to the your own {@link IShoppingSale sale}'s inquiries. Otherwise, you
     * can access to every inquiries of the sales.
     *
     * @param saleId Belonged sale's {@link IShoppingSale.id}
     * @param inquiryId Belonged inquiry's {@link IShoppingSaleInquiry.id}
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated inquiry comments
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("inquiryId")
      inquiryId: string & tags.Format<"uuid">,
      @core.TypedBody() input: IShoppingSaleInquiryComment.IRequest
    ): Promise<IPage<IShoppingSaleInquiryComment>> {
      return ShoppingSaleSnapshotInquiryCommentProvider.index({
        actor,
        sale: { id: saleId },
        inquiry: { id: inquiryId },
        input,
      });
    }

    /**
     * Get an inquiry comment info.
     *
     * Get a detailed {@link IShoppingSaleInquiryComment inquiry comment}
     * information of a {@link IShoppingSaleQuestion question} or
     * {@link IShoppingSaleReview review}.
     *
     * For reference, if you're a {@link IShoppingSeller seller}, you can only
     * access to the your own {@link IShoppingSale sale}'s inquiry comment.
     * Otherwise, you can access to every inquiry comments of the sales.
     *
     * @param saleId Belonged sale's {@link IShoppingSale.id}
     * @param inquiryId Belonged inquiry's {@link IShoppingSaleInquiry.id}
     * @param id Target inquiry comment's {@link IShoppingSaleInquiryComment.id}
     * @returns Detailed inquiry comment info
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("inquiryId")
      inquiryId: string & tags.Format<"uuid">,
      @core.TypedParam("id") id: string & tags.Format<"uuid">
    ): Promise<IShoppingSaleInquiryComment> {
      return ShoppingSaleSnapshotInquiryCommentProvider.at({
        actor,
        sale: { id: saleId },
        inquiry: { id: inquiryId },
        id,
      });
    }

    /**
     * Create an inquiry comment.
     *
     * Create an {@link IShoppingSaleInquiryComment inquiry comment} of a
     * {@link IShoppingSaleQuestion question} or {@link IShoppingSaleReview review}.
     *
     * For reference, if you're a {@link IShoppingSeller seller}, you can only
     * create an inquiry comment to your own {@link IShoppingSale sale}'s inquiry.
     * Otherwise, you can create an inquiry comment to every inquiries of the sales.
     *
     * @param saleId Belonged sale's {@link IShoppingSale.id}
     * @param inquiryId Target inquiry's {@link IShoppingSaleInquiry.id}
     * @param input Creation info of the inquiry comment
     * @returns Newly created inquiry comment
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Post()
    public async create(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("inquiryId")
      inquiryId: string & tags.Format<"uuid">,
      @core.TypedBody() input: IShoppingSaleInquiryComment.ICreate
    ): Promise<IShoppingSaleInquiryComment> {
      return ShoppingSaleSnapshotInquiryCommentProvider.create({
        actor,
        sale: { id: saleId },
        inquiry: { id: inquiryId },
        input,
      });
    }

    /**
     * Update an inquiry comment.
     *
     * Update an {@link IShoppingSaleInquiryComment inquiry comment} to a specific
     * {@link IShoppingSaleQuestion question} or {@link IShoppingSaleReview review}.
     *
     * By the way, as is the general policy of this shopping mall regarding
     * comments, modifying a comment does not actually change the existing content.
     * Modified content is accumulated and recorded in the existing comment record
     * as a new {@link IShoppingSaleInquiryComment.ISnapshot snapshot}. And this
     * is made public to everyone, who can read this inquiry comment.
     *
     * This is to prevent customers or sellers from modifying their comments and
     * manipulating the circumstances due to the nature of e-commerce, where
     * disputes easily arise. That is, to preserve evidence.
     *
     * @param saleId Belonged sale's {@link IShoppingSale.id}
     * @param inquiryId Belonged inquiry's {@link IShoppingSaleInquiry.id}
     * @param id Target inquiry comment's {@link IShoppingSaleInquiryComment.id}
     * @param input Update info of the inquiry comment
     * @returns Newly created snapshot record of the inquiry comment
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Put(":id")
    public async update(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("inquiryId")
      inquiryId: string & tags.Format<"uuid">,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
      @core.TypedBody() input: IShoppingSaleInquiryComment.IUpdate
    ): Promise<IShoppingSaleInquiryComment.ISnapshot> {
      return ShoppingSaleSnapshotInquiryCommentProvider.update({
        actor,
        sale: { id: saleId },
        inquiry: { id: inquiryId },
        id,
        input,
      });
    }
  }
  return ShoppingSaleInquiryCommentController;
}
