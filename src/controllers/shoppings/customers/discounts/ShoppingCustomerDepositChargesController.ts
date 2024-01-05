import core from "@nestia/core";
import { Controller } from "@nestjs/common";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDepositCharge } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositCharge";

import { ShoppingDepositChargeProvider } from "../../../../providers/shoppings/deposits/ShoppingDepositChargeProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/deposits/charges`)
export class ShoppingCustomerDepositChargesController {
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingDepositCharge.IRequest,
  ): Promise<IPage<IShoppingDepositCharge>> {
    return ShoppingDepositChargeProvider.index(customer)(input);
  }

  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("id") id: string,
  ): Promise<IShoppingDepositCharge> {
    return ShoppingDepositChargeProvider.at(customer)(id);
  }

  @core.TypedRoute.Post()
  public async create(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingDepositCharge.ICreate,
  ): Promise<IShoppingDepositCharge> {
    return ShoppingDepositChargeProvider.create(customer)(input);
  }

  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("id") id: string,
    @core.TypedBody() input: IShoppingDepositCharge.IUpdate,
  ): Promise<void> {
    return ShoppingDepositChargeProvider.update(customer)(id)(input);
  }

  @core.TypedRoute.Delete(":id")
  public async erase(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("id") id: string,
  ): Promise<void> {
    return ShoppingDepositChargeProvider.erase(customer)(id);
  }
}
