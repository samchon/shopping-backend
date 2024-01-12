import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleInquiryCommentsController } from "../../base/sales/ShoppingSaleInquiryCommentsController";

export class ShoppingSellerSaleReviewCommentController extends ShoppingSaleInquiryCommentsController(
  "reviews",
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
