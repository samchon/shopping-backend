import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleQuestionsController } from "../../base/sales/ShoppingSaleQuestionsController";

export class ShoppingSellerSaleQuestionsController extends ShoppingSaleQuestionsController(
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
