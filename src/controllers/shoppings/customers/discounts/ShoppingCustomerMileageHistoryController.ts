import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMileageHistory } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageHistory";

import { ShoppingMileageHistoryProvider } from "../../../../providers/shoppings/mileages/ShoppingMileageHistoryProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/mileages/histories`)
export class ShoppingCustomerMileageHistoryController {
  /**
   * List up every mileage histories.
   *
   * List up every {@link IShoppingMileageHistory mileage histories} of the
   * {@link IShoppingCustomer customer} with {@link IPage pagination}.
   *
   * If you want, you can limit the result by configuring
   * {@link IShoppingMileageHistory.IRequest.search search condition} in the
   * request body. Also, it is possible to customize sequence order of records
   * by configuring {@link IShoppingMileageHistory.IRequest.sort sort condition}.
   *
   * @param input Request info of pagination, searching and sorting
   * @returns Paginated mileage histories
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingMileageHistory.IRequest,
  ): Promise<IPage<IShoppingMileageHistory>> {
    return ShoppingMileageHistoryProvider.index(customer.citizen!)(input);
  }

  /**
   * Get a mileage history info.
   *
   * Get a {@link IShoppingMileageHistory mileage history} information.
   *
   * @param id Target mileage history's {@link IShoppingMileageHistory.id}
   * @returns Mileage history info
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingMileageHistory> {
    return ShoppingMileageHistoryProvider.at(customer.citizen!)(id);
  }

  /**
   * Get balance of the mileage.
   *
   * Get current balance of the mileage of the {@link IShoppingCustomer customer}.
   *
   * @returns Balance of the mileage
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Get("balance")
  public async balance(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
  ): Promise<number> {
    return ShoppingMileageHistoryProvider.getBalance(customer.citizen!);
  }
}
