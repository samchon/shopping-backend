import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleQuestionsController } from "../../base/sales/ShoppingSaleQuestionsController";

export class ShoppingAdminSaleQuestionController extends ShoppingSaleQuestionsController(
  {
    path: "admins",
    AuthGuard: ShoppingAdminAuth,
  },
) {}
