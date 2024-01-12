import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSaleInquiryCommentController } from "../../base/sales/ShoppingSaleInquiryCommentController";

export class ShoppingCustomerSaleReviewCommentController extends ShoppingSaleInquiryCommentController(
  "reviews",
  {
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
  },
) {}
