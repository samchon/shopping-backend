import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingCouponsReadableController } from "../../base/discounts/ShoppingCouponsReadableController";

export class ShoppingCustomerCouponsController extends ShoppingCouponsReadableController(
  {
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
  },
) {}
