import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleInquiryCommentsController } from "../../base/sales/ShoppingSaleInquiryCommentsController";

export class ShoppingAdminSaleQuestionCommentsController extends ShoppingSaleInquiryCommentsController(
    "questions",
    {
        path: "admins",
        AuthGuard: ShoppingAdminAuth,
    },
) {}
