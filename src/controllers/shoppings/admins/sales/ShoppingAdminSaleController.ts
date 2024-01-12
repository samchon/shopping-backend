import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleController } from "../../base/sales/ShoppingSaleController";

export class ShoppingAdminSaleController extends ShoppingSaleController({
  path: "admins",
  AuthGuard: ShoppingAdminAuth,
}) {}
