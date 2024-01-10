import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleInquiryCommentsController } from "../../base/sales/ShoppingSaleInquiryCommentsController";

export class ShoppingAdminSaleQuestionCommentController extends ShoppingSaleInquiryCommentsController(
  "questions",
  {
    path: "admins",
    AuthGuard: ShoppingAdminAuth,
  },
) {}
