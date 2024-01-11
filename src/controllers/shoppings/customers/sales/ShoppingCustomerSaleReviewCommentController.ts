import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSaleInquiryCommentsController } from "../../base/sales/ShoppingSaleInquiryCommentsController";

export class ShoppingCustomerSaleReviewCommentController extends ShoppingSaleInquiryCommentsController(
  "reviews",
  {
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
  },
) {}
