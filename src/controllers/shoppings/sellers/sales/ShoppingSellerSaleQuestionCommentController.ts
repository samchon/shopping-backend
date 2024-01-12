import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleInquiryCommentController } from "../../base/sales/ShoppingSaleInquiryCommentController";

export class ShoppingSellerSaleQuestionCommentController extends ShoppingSaleInquiryCommentController(
  "questions",
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
