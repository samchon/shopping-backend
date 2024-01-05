import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDepositHistory } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositHistory";

import { ShoppingDepositHistoryProvider } from "../../../../providers/shoppings/deposits/ShoppingDepositHistoryProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/deposits/histories`)
export class ShoppingCustomerDepositHistoriesController {
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingDepositHistory.IRequest,
  ): Promise<IPage<IShoppingDepositHistory>> {
    return ShoppingDepositHistoryProvider.index(customer.citizen!)(input);
  }

  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingDepositHistory> {
    return ShoppingDepositHistoryProvider.at(customer.citizen!)(id);
  }

  @core.TypedRoute.Get("balance")
  public async balance(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
  ): Promise<number> {
    return ShoppingDepositHistoryProvider.getBalance(customer.citizen!);
  }
}
