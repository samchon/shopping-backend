import { ShoppingCustomerSaleController } from "../../../../src/controllers/shoppings/customers/sales/ShoppingCustomerSaleController";
import { IFunctionCallBenchmarkScenario } from "../structures/IFunctionCallBenchmarkScenario";

export const scenario_sale_find = (): IFunctionCallBenchmarkScenario => ({
  title: "Sale Find",
  prompt: `Would you find "Surface Pro 9" in the market?`,
  expected: {
    type: "standalone",
    function: ShoppingCustomerSaleController.prototype.details,
  },
});
