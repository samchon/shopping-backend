import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleReviewController } from "../../base/sales/ShoppingSaleReviewController";

export class ShoppingAdminSaleReviewController extends ShoppingSaleReviewController(
  {
    path: "admins",
    AuthGuard: ShoppingAdminAuth,
  },
) {}
