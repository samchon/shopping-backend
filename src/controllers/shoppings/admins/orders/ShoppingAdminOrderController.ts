import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingOrderController } from "../../base/orders/ShoppingOrderController";

export class ShoppingAdminOrderController extends ShoppingOrderController({
  path: "admins",
  AuthGuard: ShoppingAdminAuth,
}) {}
