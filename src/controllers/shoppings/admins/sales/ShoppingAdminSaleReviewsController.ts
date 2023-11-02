import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleReviewsController } from "../../base/sales/ShoppingSaleReviewsController";

export class ShoppingAdminSaleReviewsController extends ShoppingSaleReviewsController(
    {
        path: "admins",
        AuthGuard: ShoppingAdminAuth,
    },
) {}
