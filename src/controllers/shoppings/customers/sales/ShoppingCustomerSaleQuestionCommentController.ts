import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSaleInquiryCommentController } from "../../base/sales/ShoppingSaleInquiryCommentController";

export class ShoppingCustomerSaleQuestionCommentController extends ShoppingSaleInquiryCommentController(
  "questions",
  {
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
  },
) {}
