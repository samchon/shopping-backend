import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSystematicSectionController } from "../../base/systematic/ShoppingSystematicSectionController";

export class ShoppingSellerSystematicSectionController extends ShoppingSystematicSectionController(
  {
    AuthGuard: ShoppingSellerAuth,
    path: "sellers",
  },
) {}
