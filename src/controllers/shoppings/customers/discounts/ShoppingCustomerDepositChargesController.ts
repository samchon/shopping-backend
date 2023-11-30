import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDepositCharge } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositCharge";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/deposits/charges`)
export class ShoppingCustomerDepositChargesController {
    @core.TypedRoute.Patch()
    public async index(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedBody() input: IShoppingDepositCharge.IRequest,
    ): Promise<IShoppingDepositCharge> {
        customer;
        input;
        return null!;
    }

    @core.TypedRoute.Get(":id")
    public async at(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("id") id: string,
    ): Promise<IShoppingDepositCharge> {
        customer;
        id;
        return null!;
    }

    @core.TypedRoute.Post()
    public async create(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedBody() input: IShoppingDepositCharge.ICreate,
    ): Promise<IShoppingDepositCharge> {
        customer;
        input;
        return null!;
    }

    @core.TypedRoute.Put(":id")
    public async update(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("id") id: string,
        @core.TypedBody() input: IShoppingDepositCharge.IUpdate,
    ): Promise<IShoppingDepositCharge> {
        customer;
        id;
        input;
        return null!;
    }

    @core.TypedRoute.Delete(":id")
    public async erase(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("id") id: string,
    ): Promise<void> {
        customer;
        id;
    }
}
