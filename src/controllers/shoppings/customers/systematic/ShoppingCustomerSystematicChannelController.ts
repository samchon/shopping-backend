import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSystematicChannelController } from "../../base/systematic/ShoppingSystematicChannelController";

export class ShoppingCustomerSystematicChannelController extends ShoppingSystematicChannelController(
  {
    AuthGuard: ShoppingCustomerAuth,
    path: "customers",
  },
) {}
