import { ShoppingCustomerSaleController } from "../../../../src/controllers/shoppings/customers/sales/ShoppingCustomerSaleController";
import { IFunctionCallBenchmarkScenario } from "../structures/IFunctionCallBenchmarkScenario";
import { ScenarioPromptCollection } from "./ScenarioPromptCollection";

export const scenario_sale_find = (): IFunctionCallBenchmarkScenario => ({
  title: "Sale Find",
  prompt: ScenarioPromptCollection.SP9[0],
  expected: {
    type: "standalone",
    function: ShoppingCustomerSaleController.prototype.details,
  },
});
