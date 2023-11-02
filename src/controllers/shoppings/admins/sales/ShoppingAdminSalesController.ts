import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSalesController } from "../../base/sales/ShoppingSalesController";

export class ShoppingAdminSalesController extends ShoppingSalesController({
    path: "admins",
    AuthGuard: ShoppingAdminAuth,
}) {}
