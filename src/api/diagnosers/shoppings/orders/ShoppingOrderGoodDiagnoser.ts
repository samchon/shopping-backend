import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingCartCommodity } from "../../../structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrderGood } from "../../../structures/shoppings/orders/IShoppingOrderGood";

import { ShoppingSaleDiagnoser } from "../sales";

export namespace ShoppingOrderGoodDiagnoser {
  export const validate =
    (commodity: IShoppingCartCommodity) =>
    (input: IShoppingOrderGood.ICreate, i: number): IDiagnosis[] => {
      const output: IDiagnosis[] = ShoppingSaleDiagnoser.readable({
        accessor: `input.goods.${i}.commodity.sale`,
        checkPause: true,
      })(commodity.sale);
      for (const unit of commodity.sale.units)
        for (const stock of unit.stocks)
          if (
            stock.quantity * input.volume >
            stock.inventory.income - stock.inventory.outcome
          )
            output.push({
              accessor: `input.goods.${i}.volume`,
              message: `Not enough inventory on nested stock#${stock.id}.`,
            });
      return output;
    };
}
