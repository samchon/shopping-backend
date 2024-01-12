import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleSnapshotController } from "../../base/sales/ShoppingSaleSnapshotController";

export class ShoppingAdminSaleSnapshotController extends ShoppingSaleSnapshotController(
  {
    path: "admins",
    AuthGuard: ShoppingAdminAuth,
  },
) {}
