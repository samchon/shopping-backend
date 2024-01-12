import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleInquiryCommentController } from "../../base/sales/ShoppingSaleInquiryCommentController";

export class ShoppingAdminSaleReviewCommentController extends ShoppingSaleInquiryCommentController(
  "reviews",
  {
    path: "admins",
    AuthGuard: ShoppingAdminAuth,
  },
) {}
