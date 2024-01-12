import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleQuestionsController } from "../../base/sales/ShoppingSaleQuestionsController";

export class ShoppingSellerSaleQuestionController extends ShoppingSaleQuestionsController(
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
