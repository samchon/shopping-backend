import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDepositHistory } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositHistory";

import { ShoppingDepositHistoryProvider } from "../../../../providers/shoppings/deposits/ShoppingDepositHistoryProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/deposits/histories`)
export class ShoppingCustomerDepositHistoryController {
  /**
   * List up every deposit histories.
   *
   * List up every {@link IShoppingDepositHistory deposit histories} of the
   * {@link IShoppingCustomer customer} with {@link IPage pagination}.
   *
   * If you want, you can limit the result by configuring
   * {@link IShoppingDepositHistory.IRequest.search search condition} in the
   * request body. Also, it is possible to customize sequence order of records
   * by configuring {@link IShoppingDepositHistory.IRequest.sort sort condition}.
   *
   * @param input Request info of pagination, searching and sorting
   * @returns Paginated deposit histories
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingDepositHistory.IRequest,
  ): Promise<IPage<IShoppingDepositHistory>> {
    return ShoppingDepositHistoryProvider.index(customer.citizen!)(input);
  }

  /**
   * Get a deposit history info.
   *
   * Get a {@link IShoppingDepositHistory deposit history} information.
   *
   * @param id
   * @returns Deposit history info
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingDepositHistory> {
    return ShoppingDepositHistoryProvider.at(customer.citizen!)(id);
  }

  /**
   * Get balance of the deposit.
   *
   * Get current balance of the deposit of the {@link IShoppingCustomer customer}.
   *
   * @returns Balance of the deposit
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Get("balance")
  public async balance(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
  ): Promise<number> {
    return ShoppingDepositHistoryProvider.getBalance(customer.citizen!);
  }
}
