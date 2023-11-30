import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDepositChargePublish } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositChargePublish";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/deposits/charges/:chargeId/publish`)
export class ShoppingCustomerDepositChargePublishesController {
  public async able(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("chargeId") chargeId: string & tags.Format<"uuid">,
  ): Promise<boolean> {
    customer;
    chargeId;
    return null!;
  }

  @core.TypedRoute.Post()
  public async create(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("chargeId") chargeId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingDepositChargePublish.ICreate,
  ): Promise<IShoppingDepositChargePublish> {
    customer;
    chargeId;
    input;
    return null!;
  }

  @core.TypedRoute.Delete()
  public async erase(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("chargeId") chargeId: string & tags.Format<"uuid">,
  ): Promise<void> {
    customer;
    chargeId;
  }
}
