import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleReviewController } from "../../base/sales/ShoppingSaleReviewController";

export class ShoppingSellerSaleReviewController extends ShoppingSaleReviewController(
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
