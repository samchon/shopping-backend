import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleInquiryCommentsController } from "../../base/sales/ShoppingSaleInquiryCommentsController";

export class ShoppingSellerSaleReviewCommentsController extends ShoppingSaleInquiryCommentsController(
  "reviews",
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
