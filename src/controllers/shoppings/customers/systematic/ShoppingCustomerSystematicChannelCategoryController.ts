import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSystematicChannelCategoryController } from "../../base/systematic/ShoppingSystematicChannelCategoryController";

export class ShoppingCustomerSystematicChannelCategoryController extends ShoppingSystematicChannelCategoryController(
  {
    AuthGuard: ShoppingCustomerAuth,
    path: "customers",
  },
) {}
