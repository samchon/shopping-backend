import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleReviewsController } from "../../base/sales/ShoppingSaleReviewsController";

export class ShoppingSellerSaleReviewsController extends ShoppingSaleReviewsController(
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
