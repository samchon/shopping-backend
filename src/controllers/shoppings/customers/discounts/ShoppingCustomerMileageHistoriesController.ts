import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMileageHistory } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageHistory";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/mileages/histories`)
export class ShoppingCustomerMileageHistoriesController {
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingMileageHistory.IRequest,
  ): Promise<IPage<IShoppingMileageHistory>> {
    customer;
    input;
    return null!;
  }

  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingMileageHistory> {
    customer;
    id;
    return null!;
  }
}
