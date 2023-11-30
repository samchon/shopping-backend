import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSaleSnapshotsController } from "../../base/sales/ShoppingSaleSnapshotsController";

export class ShoppingCustomerSaleSnapshotsController extends ShoppingSaleSnapshotsController(
  {
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
  },
) {}
