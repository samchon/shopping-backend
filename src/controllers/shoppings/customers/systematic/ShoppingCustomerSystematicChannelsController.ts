import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSystematicChannelsController } from "../../base/systematic/ShoppingSystematicChannelsController";

export class ShoppingCustomerSystematicChannelsController extends ShoppingSystematicChannelsController(
  {
    AuthGuard: ShoppingCustomerAuth,
    path: "customers",
  },
) {}
