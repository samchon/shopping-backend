import core from "@nestia/core";
import { Controller } from "@nestjs/common";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";

import { ShoppingMemberPasswordProvider } from "../../../../providers/shoppings/actors/ShoppingMemberPasswordProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller("shoppings/customers/authenticate/password")
export class ShoppingCustomerAuthenticatePasswordController {
  @core.TypedRoute.Put("change")
  public async change(
    @ShoppingCustomerAuth("member") customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingMember.IPasswordChange,
  ): Promise<void> {
    return ShoppingMemberPasswordProvider.change(customer)(input);
  }

  // @core.TypedRoute.Delete("reset")
  // public async reset(
  //   @ShoppingCustomerAuth("member") customer: IShoppingCustomer,
  //   @core.TypedBody() input: IShoppingMember.IPasswordReset,
  // ): Promise<void> {
  //   customer;
  //   input;
  // }

  // @core.TypedRoute.Get(":token")
  // public async confirm(
  //   @ShoppingCustomerAuth("member") customer: IShoppingCustomer,
  //   @core.TypedParam("token") input: string,
  // ): Promise<void> {
  //   customer;
  //   input;
  // }
}
