import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleQuestionController } from "../../base/sales/ShoppingSaleQuestionController";

export class ShoppingSellerSaleQuestionController extends ShoppingSaleQuestionController(
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
