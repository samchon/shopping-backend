import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleQuestionsController } from "../../base/sales/ShoppingSaleQuestionsController";

export class ShoppingAdminSaleQuestionsController extends ShoppingSaleQuestionsController(
    {
        path: "admins",
        AuthGuard: ShoppingAdminAuth,
    },
) {}
