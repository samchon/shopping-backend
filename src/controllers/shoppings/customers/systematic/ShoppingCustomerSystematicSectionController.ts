import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSystematicSectionController } from "../../base/systematic/ShoppingSystematicSectionController";

export class ShoppingCustomerSystematicSectionController extends ShoppingSystematicSectionController(
  {
    AuthGuard: ShoppingCustomerAuth,
    path: "customers",
  },
) {}
