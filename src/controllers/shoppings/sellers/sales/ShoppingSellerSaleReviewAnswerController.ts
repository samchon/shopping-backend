import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSaleInquiryAnswer } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryAnswer";

import { ShoppingSaleSnapshotInquiryAnswerProvider } from "../../../../providers/shoppings/sales/inquiries/ShoppingSaleSnapshotInquiryAnswerProvider";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";

@Controller("shoppings/sellers/sales/:saleId/reviews/:reviewId/answer")
export class ShoppingSellerSaleReviewAnswerController {
  /**
   * Write an answer article.
   *
   * Write a formal {@link IShoppingSaleInquiryAnswer answer article} to a
   * specific {@link IShoppingSaleInquiry review article} written by a
   * {@link IShoppingCustomer}.
   *
   * Note that, this is the formal answer that can be written only one per
   * a review article (but {@link update updatable}). Therefore, it needs to
   * guide the {@link IShoppingSeller seller} to write it carefully.
   *
   * Also, as seller can write {@link IShoppingSaleInquiryComment comments} to
   * the review article as many as he/she wants, it would be useful for
   * additional communication.
   *
   * @param saleId Belonged sale's {@link IShoppingSale.id}
   * @param reviewId Target review's {@link IShoppingSaleReview.id}
   * @param input Creation info of the answer article
   * @returns Newly created answer article
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("reviewId") reviewId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleInquiryAnswer.ICreate
  ): Promise<IShoppingSaleInquiryAnswer> {
    return ShoppingSaleSnapshotInquiryAnswerProvider.create({
      seller,
      sale: { id: saleId },
      inquiry: { id: reviewId },
      input,
    });
  }

  /**
   * Update an answer article.
   *
   * Update a formal {@link IShoppingSaleInquiryAnswer answer article} to a
   * specific {@link IShoppingSaleInquiry review article} written by a
   * {@link IShoppingCustomer}.
   *
   * By the way, as is the general policy of this shopping mall regarding
   * articles, modifying a review articles does not actually change the
   * existing content. Modified content is accumulated and recorded in the
   * existing article record as a new
   * {@link IShoppingSaleInquiryAnswer.ISnapshot snapshot}. And this is made
   * public to everyone, including the {@link IShoppingCustomer customer} and the
   * {@link IShoppingSeller seller}, and anyone who can view the article can
   * also view the entire editing histories.
   *
   * This is to prevent customers or sellers from modifying their articles and
   * manipulating the circumstances due to the nature of e-commerce, where
   * disputes easily arise. That is, to preserve evidence.
   *
   * @param saleId Belonged sale's {@link IShoppingSale.id}
   * @param reviewId Target review's {@link IShoppingSaleReview.id}
   * @param input Update info of the answer article
   * @returns Newly created snapshot record of the answer article
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Put()
  public async update(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("reviewId") reviewId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleInquiryAnswer.IUpdate
  ): Promise<IShoppingSaleInquiryAnswer.ISnapshot> {
    return ShoppingSaleSnapshotInquiryAnswerProvider.update({
      seller,
      sale: { id: saleId },
      inquiry: { id: reviewId },
      input,
    });
  }
}
