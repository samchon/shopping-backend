import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSaleInquiryAnswer } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryAnswer";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";

@Controller("shoppings/sellers/sales/:saleId/questions/:questionId/answer")
export class ShoppingSellerSaleQuestionAnswerController {
  @core.TypedRoute.Post()
  public async create(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("questionId") questionId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleInquiryAnswer.ICreate,
  ): Promise<IShoppingSaleInquiryAnswer> {
    seller;
    saleId;
    questionId;
    input;
    return null!;
  }

  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("questionId") questionId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleInquiryAnswer.IUpdate,
  ): Promise<IShoppingSaleInquiryAnswer.ISnapshot> {
    seller;
    saleId;
    questionId;
    id;
    input;
    return null!;
  }
}