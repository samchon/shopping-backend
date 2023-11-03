import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleInquiryCommentsController } from "../../base/sales/ShoppingSaleInquiryCommentsController";

export class ShoppingAdminSaleReviewCommentsController extends ShoppingSaleInquiryCommentsController(
    "reviews",
    {
        path: "admins",
        AuthGuard: ShoppingAdminAuth,
    },
) {}