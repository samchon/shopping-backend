import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ShoppingSaleQuestionProvider } from "../../../../providers/shoppings/sales/inquiries/ShoppingSaleSnapshotQuestionProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSaleQuestionController } from "../../base/sales/ShoppingSaleQuestionController";

export class ShoppingCustomerSaleQuestionController extends ShoppingSaleQuestionController(
  {
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
  }
) {
  /**
   * Write a question article.
   *
   * When a {@link IShoppingCustomer customer} wants to ask something about
   * a specific {@link IShoppingSale sale}, he/she can ask it by writing a
   * new {@link IShoppingSaleQuestion question article}.
   *
   * If the customer does not want to reveal his/her identify and question,
   * he/she can write the question as a secret article. In that case, only
   * the customer and the related {@link IShoppingSeller seller} can see
   * the {@link at detailed content}. Also, such secret question's title and
   * writer name would be masked with `*` characters in the
   * {@link index pagiation API}.
   *
   * @param saleId Belonged sale's {@link IShoppingSale.id}
   * @param input Creation info of the question
   * @returns Newly created question
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleQuestion.ICreate
  ): Promise<IShoppingSaleQuestion> {
    return ShoppingSaleQuestionProvider.create(customer)({ id: saleId })(input);
  }

  /**
   * Update a question.
   *
   * Update a {@link IShoppingSaleQuestion question}'s content.
   *
   * By the way, as is the general policy of this shopping mall regarding
   * articles, modifying a question articles does not actually change the
   * existing content. Modified content is accumulated and recorded in the
   * existing article record as a new
   * {@link IShoppingSaleQuestion.ISnapshot snapshot}. And this is made public
   * to everyone, including the {@link IShoppingCustomer customer} and the
   * {@link IShoppingSeller seller}, and anyone who can view the article can
   * also view the entire editing histories.
   *
   * This is to prevent customers or sellers from modifying their articles and
   * manipulating the circumstances due to the nature of e-commerce, where
   * disputes easily arise. That is, to preserve evidence.
   *
   * @param saleId Belonged sale's {@link IShoppingSale.id}
   * @param id Target question's {@link IShoppingSaleQuestion.id}
   * @param input Update info of the question
   * @returns Newly created snapshot record of the question
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Post(":id")
  public async update(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleQuestion.IUpdate
  ): Promise<IShoppingSaleQuestion.ISnapshot> {
    return ShoppingSaleQuestionProvider.update(customer)({
      id: saleId,
    })(id)(input);
  }
}
