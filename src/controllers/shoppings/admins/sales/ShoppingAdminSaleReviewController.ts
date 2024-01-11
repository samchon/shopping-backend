import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleReviewsController } from "../../base/sales/ShoppingSaleReviewsController";

export class ShoppingAdminSaleReviewController extends ShoppingSaleReviewsController(
  {
    path: "admins",
    AuthGuard: ShoppingAdminAuth,
  },
) {}
