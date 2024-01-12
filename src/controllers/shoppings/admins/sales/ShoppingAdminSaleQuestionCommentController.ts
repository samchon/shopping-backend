import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleInquiryCommentController } from "../../base/sales/ShoppingSaleInquiryCommentController";

export class ShoppingAdminSaleQuestionCommentController extends ShoppingSaleInquiryCommentController(
  "questions",
  {
    path: "admins",
    AuthGuard: ShoppingAdminAuth,
  },
) {}
