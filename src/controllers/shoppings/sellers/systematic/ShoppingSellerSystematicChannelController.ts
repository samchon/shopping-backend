import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSystematicChannelController } from "../../base/systematic/ShoppingSystematicChannelController";

export class ShoppingSellerSystematicChannelController extends ShoppingSystematicChannelController(
  {
    AuthGuard: ShoppingSellerAuth,
    path: "sellers",
  },
) {}
