import core from "@nestia/core";
import { Controller } from "@nestjs/common";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";

import { ShoppingSellerProvider } from "../../../../providers/shoppings/actors/ShoppingSellerProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";

@Controller("shoppings/sellers/authenticate")
export class ShoppingSellerAuthenticateController {
  /**
   * Get seller information.
   *
   * Get {@link IShoppingSeller.IInvert seller} information of
   * current {@link IShoppingCustomer customer}.
   *
   * If current {@link IShoppingMember member} is not an seller,
   * it throws 403 forbidden exception.
   *
   * @returns Seller info
   * @tag Authenticate
   *
   * @author Samchon
   */
  @core.TypedRoute.Get()
  public async get(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert
  ): Promise<IShoppingSeller.IInvert> {
    return seller;
  }

  /**
   * Join as an seller.
   *
   * Join as an seller with {@link IShoppingSeller.IJoin joining info}.
   *
   * This method is allowed only when the {@link IShoppingCustomer customer} already
   * has joined the {@link IShoppingMember membership}. IF not, he (she) must
   * accomplish it before. If not, 403 forbidden exception would be thrown.
   *
   * @param input Joining request info
   * @returns Seller info
   * @tag Authenticate
   *
   * @todo Need to add approval process
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async join(
    @ShoppingCustomerAuth("member") customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingSeller.IJoin
  ): Promise<IShoppingSeller.IInvert> {
    return ShoppingSellerProvider.join(customer)(input);
  }

  /**
   * Login as an seller.
   *
   * Login as an seller with {@link IShoppingSeller.ILogin login info}.
   *
   * This method has exactly same effect with
   * {@link ShoppingApi.functional.customers.authenticate.login} function, but
   * returned type is a llttle different. The similar function returns
   * {@link IShoppingCustomer} type that starting from the customer information, so
   * that you have to access to the seller info through
   * `customer.member.seller`. In contrast with that, this method returns
   * {@link IShoppingSeller.IInvert} type that starting from the seller
   * info, so that can access to the customer info through `seller.customer`.
   *
   * Of course, to use this function, you had to {@link join} as an seller
   * before. If not, 403 forbidden exception would be thrown,
   *
   * @param input Login request info
   * @returns Seller info
   * @tag Authenticate
   *
   * @author Samchon
   */
  @core.TypedRoute.Put("login")
  public async login(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingMember.ILogin
  ): Promise<IShoppingSeller.IInvert> {
    return ShoppingSellerProvider.login(customer)(input);
  }
}
