import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSaleReview } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleReview";

import { ShoppingSaleReviewProvider } from "../../../../providers/shoppings/sales/inquiries/ShoppingSaleSnapshotReviewProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSaleReviewController } from "../../base/sales/ShoppingSaleReviewController";

export class ShoppingCustomerSaleReviewController extends ShoppingSaleReviewController(
  {
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
  }
) {
  /**
   * Write a review article.
   *
   * When a {@link IShoppingCustomer customer} has purchased a specific
   * {@link IShoppingSale sale} and get {@link IShoppingDelivery delivered} it,
   * he/she can write a {@link IShoppingSaleReview review} article about the sale.
   *
   * If try to write a review article without purchasing or the delivery has not
   * been completed, 428 unprocessable entity error would be thrown. Also, the
   * customer can write multiple review articles per an order, but the next
   * article can be written after 2 weeks from the previous article. If not,
   * 428 unprocessable entity error would be thrown, either.
   *
   * @param saleId Belonged sale's {@link IShoppingSale.id}
   * @param input Creation info of the review
   * @returns Newly created review
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleReview.ICreate
  ): Promise<IShoppingSaleReview> {
    return ShoppingSaleReviewProvider.create(customer)({ id: saleId })(input);
  }

  /**
   * Update a review.
   *
   * Updadte a {@link IShoppingSaleReview review}'s content and score.
   *
   * By the way, as is the general policy of this shopping mall regarding
   * articles, modifying a question articles does not actually change the
   * existing content. Modified content is accumulated and recorded in the
   * existing article record as a new
   * {@link IShoppingSaleReview.ISnapshot snapshot}. And this is made public
   * to everyone, including the {@link IShoppingCustomer customer} and the
   * {@link IShoppingSeller seller}, and anyone who can view the article can
   * also view the entire editing histories.
   *
   * This is to prevent customers or sellers from modifying their articles and
   * manipulating the circumstances due to the nature of e-commerce, where
   * disputes easily arise. That is, to preserve evidence.
   *
   * @param saleId Belonged sale's {@link IShoppingSale.id}
   * @param id Target review's {@link IShoppingSaleReview.id}
   * @param input Update info of the review
   * @returns Newly created snapshot record of the review
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Post(":id")
  public async update(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleReview.IUpdate
  ): Promise<IShoppingSaleReview.ISnapshot> {
    return ShoppingSaleReviewProvider.update(customer)({
      id: saleId,
    })(id)(input);
  }
}
