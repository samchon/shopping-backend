import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSystematicChannelCategoryController } from "../../base/systematic/ShoppingSystematicChannelCategoryController";

export class ShoppingSellerSystematicChannelCategoryController extends ShoppingSystematicChannelCategoryController(
  {
    AuthGuard: ShoppingSellerAuth,
    path: "sellers",
  },
) {}
