import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSystematicChannelsController } from "../../base/systematic/ShoppingSystematicChannelsController";

export class ShoppingSellerSystematicChannelsController extends ShoppingSystematicChannelsController(
  {
    AuthGuard: ShoppingSellerAuth,
    path: "sellers",
  },
) {}
