import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ShoppingSaleQuestionProvider } from "../../../../providers/shoppings/sales/inquiries/ShoppingSaleSnapshotQuestionProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSaleQuestionsController } from "../../base/sales/ShoppingSaleQuestionsController";

export class ShoppingCustomerSaleQuestionsController extends ShoppingSaleQuestionsController(
  {
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
  },
) {
  @core.TypedRoute.Post()
  public async create(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleQuestion.ICreate,
  ): Promise<IShoppingSaleQuestion> {
    return ShoppingSaleQuestionProvider.create(customer)({ id: saleId })(input);
  }

  @core.TypedRoute.Post(":id")
  public async update(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleQuestion.IUpdate,
  ): Promise<IShoppingSaleQuestion.ISnapshot> {
    return ShoppingSaleQuestionProvider.update(customer)({
      id: saleId,
    })(id)(input);
  }
}
