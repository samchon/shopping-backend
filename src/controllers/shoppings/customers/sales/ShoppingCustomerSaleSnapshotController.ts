import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSaleSnapshotController } from "../../base/sales/ShoppingSaleSnapshotController";

export class ShoppingCustomerSaleSnapshotController extends ShoppingSaleSnapshotController(
  {
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
  },
) {}
