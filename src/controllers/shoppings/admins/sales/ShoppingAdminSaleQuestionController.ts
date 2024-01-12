import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleQuestionController } from "../../base/sales/ShoppingSaleQuestionController";

export class ShoppingAdminSaleQuestionController extends ShoppingSaleQuestionController(
  {
    path: "admins",
    AuthGuard: ShoppingAdminAuth,
  },
) {}
