import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSystematicChannelCategoriesController } from "../../base/systematic/ShoppingSystematicChannelCategoriesController";

export class ShoppingCustomerSystematicChannelCategoryController extends ShoppingSystematicChannelCategoriesController(
  {
    AuthGuard: ShoppingCustomerAuth,
    path: "customers",
  },
) {}
