import { ShoppingCustomerCartCommodityController } from "../../../../src/controllers/shoppings/customers/orders/ShoppingCustomerCartCommodityController";
import { ShoppingCustomerSaleController } from "../../../../src/controllers/shoppings/customers/sales/ShoppingCustomerSaleController";
import { IFunctionCallBenchmarkScenario } from "../structures/IFunctionCallBenchmarkScenario";

export const scenario_cart_create = (): IFunctionCallBenchmarkScenario => ({
  title: "Cart Create",
  prompt: `
Would you find "Surface Pro 9" in the market?

And then show me the detailed information of it, 
and put the most expensive stock to the shopping cart.
`,
  expected: {
    type: "array",
    items: [
      {
        type: "standalone",
        function: ShoppingCustomerSaleController.prototype.details,
      },
      {
        type: "standalone",
        function: ShoppingCustomerCartCommodityController.prototype.create,
      },
    ],
  },
});
