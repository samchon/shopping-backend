import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingOrdersController } from "../../base/orders/ShoppingOrdersController";

export class ShoppingAdminOrderController extends ShoppingOrdersController({
  path: "admins",
  AuthGuard: ShoppingAdminAuth,
}) {}
