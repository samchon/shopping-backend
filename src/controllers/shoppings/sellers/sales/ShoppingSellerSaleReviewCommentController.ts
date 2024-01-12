import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleInquiryCommentController } from "../../base/sales/ShoppingSaleInquiryCommentController";

export class ShoppingSellerSaleReviewCommentController extends ShoppingSaleInquiryCommentController(
  "reviews",
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
