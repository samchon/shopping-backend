import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSystematicChannelsController } from "../../base/systematic/ShoppingSystematicChannelsController";

export class ShoppingCustomerSystematicChannelController extends ShoppingSystematicChannelsController(
  {
    AuthGuard: ShoppingCustomerAuth,
    path: "customers",
  },
) {}
