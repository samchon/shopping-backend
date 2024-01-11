import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSaleInquiryCommentsController } from "../../base/sales/ShoppingSaleInquiryCommentsController";

export class ShoppingCustomerSaleQuestionCommentController extends ShoppingSaleInquiryCommentsController(
  "questions",
  {
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
  },
) {}
