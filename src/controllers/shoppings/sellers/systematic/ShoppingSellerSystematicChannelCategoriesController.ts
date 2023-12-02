import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSystematicChannelCategoriesController } from "../../base/systematic/ShoppingSystematicChannelCategoriesController";

export class ShoppingSellerSystematicChannelCategoriesController extends ShoppingSystematicChannelCategoriesController(
  {
    AuthGuard: ShoppingSellerAuth,
    path: "sellers",
  },
) {}
