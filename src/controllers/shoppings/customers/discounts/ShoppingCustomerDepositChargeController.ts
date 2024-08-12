import core from "@nestia/core";
import { Controller } from "@nestjs/common";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDepositCharge } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositCharge";

import { ShoppingDepositChargeProvider } from "../../../../providers/shoppings/deposits/ShoppingDepositChargeProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/deposits/charges`)
export class ShoppingCustomerDepositChargeController {
  /**
   * List up every deposit charges.
   *
   * List up every {@link IShoppingDepositCharge deposit charges} of the
   * {@link IShoppingCustomer customer} with {@link IPage pagination}.
   *
   * If you want, you can limit the result by configuring
   * {@link IShoppingDepositCharge.IRequest.search search condition} in the
   * request body. Also, it is possible to customize sequence order of records
   * by configuring {@link IShoppingDepositCharge.IRequest.sort sort condition}.
   *
   * @param input Request info of pagination, searching and sorting
   * @returns Paginated deposit charges
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingDepositCharge.IRequest
  ): Promise<IPage<IShoppingDepositCharge>> {
    return ShoppingDepositChargeProvider.index(customer)(input);
  }

  /**
   * Get a deposit charge info.
   *
   * Get a {@link IShoppingDepositCharge deposit charge} information.
   *
   * @param id Target deposit charge's {@link IShoppingDepositCharge.id}
   * @returns Deposit charge info
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("id") id: string
  ): Promise<IShoppingDepositCharge> {
    return ShoppingDepositChargeProvider.at(customer)(id);
  }

  /**
   * Create a new deposit charge application.
   *
   * Create a new {@link IShoppingDepositCharge deposit charge application}.
   *
   * By the way, this function does not mean completion the deposit charge, but
   * means just {@link IShoppingCustomer customer} is appling the deposit charge.
   * The deposit charge be completed only when customer
   * {@link IShoppingDepositChargePublish.publish pay} the deposit charge.
   *
   * @param input Creation info of the deposit charge
   * @returns Newly created deposit charge
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingDepositCharge.ICreate
  ): Promise<IShoppingDepositCharge> {
    return ShoppingDepositChargeProvider.create(customer)(input);
  }

  /**
   * Update a deposit charge application.
   *
   * Update value of a {@link IShoppingDepositCharge deposit charge application}
   * that has been applied by the {@link IShoppingCustomer}.
   *
   * If the charge has been {@link IShoppingDepositChargePublish published},
   * then it is not possible to update the deposit charge. Only 410 gone exception
   * would be thrown.
   *
   * @param id Target deposit charge's {@link IShoppingDepositCharge.id}
   * @param input Value to change
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("id") id: string,
    @core.TypedBody() input: IShoppingDepositCharge.IUpdate
  ): Promise<void> {
    return ShoppingDepositChargeProvider.update(customer)(id)(input);
  }

  /**
   * Erase a deposit charge application.
   *
   * Erase a {@link IShoppingDepositCharge deposit charge application} that has been
   * applied by the {@link IShoppingCustomer}.
   *
   * If the charge has been {@link IShoppingDepositChargePublish published}, then
   * it is not possible to erase the deposit charge. In that case, you've to cancel
   * the payment by calling the {@link publish.cancel} function.
   *
   * @param id Target deposit charge's {@link IShoppingDepositCharge.id}
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Delete(":id")
  public async erase(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("id") id: string
  ): Promise<void> {
    return ShoppingDepositChargeProvider.erase(customer)(id);
  }
}
