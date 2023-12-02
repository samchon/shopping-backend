import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSystematicSectionsController } from "../../base/systematic/ShoppingSystematicSectionsController";

export class ShoppingSellerSystematicSectionsController extends ShoppingSystematicSectionsController(
  {
    AuthGuard: ShoppingSellerAuth,
    path: "sellers",
  },
) {}
