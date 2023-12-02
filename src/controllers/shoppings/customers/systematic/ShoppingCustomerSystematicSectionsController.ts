import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSystematicSectionsController } from "../../base/systematic/ShoppingSystematicSectionsController";

export class ShoppingCustomerSystematicSectionsController extends ShoppingSystematicSectionsController(
  {
    AuthGuard: ShoppingCustomerAuth,
    path: "customers",
  },
) {}
