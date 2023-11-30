import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleInquiryCommentsController } from "../../base/sales/ShoppingSaleInquiryCommentsController";

export class ShoppingSellerSaleQuestionCommentsController extends ShoppingSaleInquiryCommentsController(
  "questions",
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
