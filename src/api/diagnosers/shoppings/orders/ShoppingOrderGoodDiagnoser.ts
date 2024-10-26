import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingCartCommodity } from "../../../structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrderGood } from "../../../structures/shoppings/orders/IShoppingOrderGood";

import { ShoppingSaleDiagnoser } from "../sales";

export namespace ShoppingOrderGoodDiagnoser {
  export const validate = (props: {
    commodity: IShoppingCartCommodity;
    input: IShoppingOrderGood.ICreate;
    index: number;
  }): IDiagnosis[] => {
    const output: IDiagnosis[] = ShoppingSaleDiagnoser.readable({
      accessor: `input.goods.${props.index}.commodity.sale`,
      checkPause: true,
      sale: props.commodity.sale,
    });
    for (const unit of props.commodity.sale.units)
      for (const stock of unit.stocks)
        if (
          stock.quantity * props.input.volume >
          stock.inventory.income - stock.inventory.outcome
        )
          output.push({
            accessor: `input.goods.${props.index}.volume`,
            message: `Not enough inventory on nested stock#${stock.id}.`,
          });
    return output;
  };
}
