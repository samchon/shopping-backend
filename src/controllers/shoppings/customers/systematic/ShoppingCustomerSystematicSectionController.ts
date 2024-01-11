import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSystematicSectionsController } from "../../base/systematic/ShoppingSystematicSectionsController";

export class ShoppingCustomerSystematicSectionController extends ShoppingSystematicSectionsController(
  {
    AuthGuard: ShoppingCustomerAuth,
    path: "customers",
  },
) {}
