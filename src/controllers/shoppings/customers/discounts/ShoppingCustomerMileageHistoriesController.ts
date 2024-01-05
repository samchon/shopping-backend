import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMileageHistory } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageHistory";

import { ShoppingMileageHistoryProvider } from "../../../../providers/shoppings/mileages/ShoppingMileageHistoryProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/mileages/histories`)
export class ShoppingCustomerMileageHistoriesController {
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingMileageHistory.IRequest,
  ): Promise<IPage<IShoppingMileageHistory>> {
    return ShoppingMileageHistoryProvider.index(customer.citizen!)(input);
  }

  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingMileageHistory> {
    return ShoppingMileageHistoryProvider.at(customer.citizen!)(id);
  }

  @core.TypedRoute.Get("balance")
  public async balance(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
  ): Promise<number> {
    return ShoppingMileageHistoryProvider.getBalance(customer.citizen!);
  }
}
