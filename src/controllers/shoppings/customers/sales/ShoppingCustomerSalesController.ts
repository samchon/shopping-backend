import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSalesController } from "../../base/sales/ShoppingSalesController";

export class ShoppingCustomerSalesController extends ShoppingSalesController({
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
}) {}
