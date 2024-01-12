import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSystematicSectionsController } from "../../base/systematic/ShoppingSystematicSectionsController";

export class ShoppingSellerSystematicSectionController extends ShoppingSystematicSectionsController(
  {
    AuthGuard: ShoppingSellerAuth,
    path: "sellers",
  },
) {}
