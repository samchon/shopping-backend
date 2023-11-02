import nest from "@modules/nestjs";
import core from "@nestia/core";

import { IShoppingCustomer } from "samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";
import { IShoppingSeller } from "samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";

@nest.Controller("shoppings/sellers/authenticate")
export class ShoppingSellerAuthenticateController {
    @core.TypedRoute.Get()
    public async get(
        @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    ): Promise<IShoppingSeller.IInvert> {
        return seller;
    }

    @core.TypedRoute.Post()
    public async join(
        @ShoppingCustomerAuth("member") customer: IShoppingCustomer,
        @core.TypedBody() input: IShoppingSeller.IJoin,
    ): Promise<IShoppingSeller.IInvert> {
        customer;
        input;
        return null!;
    }

    @core.TypedRoute.Put("login")
    public async login(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedBody() input: IShoppingMember.ILogin,
    ): Promise<IShoppingSeller.IInvert> {
        customer;
        input;
        return null!;
    }
}
