import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingOrdersController } from "../../base/orders/ShoppingOrdersController";

export class ShoppingAdminOrdersController extends ShoppingOrdersController({
    path: "admins",
    AuthGuard: ShoppingAdminAuth,
}) {}
