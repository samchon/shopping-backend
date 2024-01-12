import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleReviewsController } from "../../base/sales/ShoppingSaleReviewsController";

export class ShoppingSellerSaleReviewController extends ShoppingSaleReviewsController(
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
