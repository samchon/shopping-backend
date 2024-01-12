import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSystematicChannelsController } from "../../base/systematic/ShoppingSystematicChannelsController";

export class ShoppingSellerSystematicChannelController extends ShoppingSystematicChannelsController(
  {
    AuthGuard: ShoppingSellerAuth,
    path: "sellers",
  },
) {}
