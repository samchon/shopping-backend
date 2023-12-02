import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSystematicChannelCategoriesController } from "../../base/systematic/ShoppingSystematicChannelCategoriesController";

export class ShoppingCustomerSystematicChannelCategoriesController extends ShoppingSystematicChannelCategoriesController(
  {
    AuthGuard: ShoppingCustomerAuth,
    path: "customers",
  },
) {}
