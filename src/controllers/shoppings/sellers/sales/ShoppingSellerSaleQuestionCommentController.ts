import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleInquiryCommentsController } from "../../base/sales/ShoppingSaleInquiryCommentsController";

export class ShoppingSellerSaleQuestionCommentController extends ShoppingSaleInquiryCommentsController(
  "questions",
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
