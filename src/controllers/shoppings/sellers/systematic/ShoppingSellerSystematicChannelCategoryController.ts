import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSystematicChannelCategoriesController } from "../../base/systematic/ShoppingSystematicChannelCategoriesController";

export class ShoppingSellerSystematicChannelCategoryController extends ShoppingSystematicChannelCategoriesController(
  {
    AuthGuard: ShoppingSellerAuth,
    path: "sellers",
  },
) {}
