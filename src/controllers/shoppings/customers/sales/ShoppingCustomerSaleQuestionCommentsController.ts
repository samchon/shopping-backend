import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSaleInquiryCommentsController } from "../../base/sales/ShoppingSaleInquiryCommentsController";

export class ShoppingCustomerSaleQuestionCommentsController extends ShoppingSaleInquiryCommentsController(
  "questions",
  {
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
  },
) {}
