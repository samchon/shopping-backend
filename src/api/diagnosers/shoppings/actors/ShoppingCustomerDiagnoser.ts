import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";

export namespace ShoppingCustomerDiagnoser {
  export const invert = (actor: IShoppingActorEntity) =>
    actor.type === "customer" ? actor : actor.customer;
}
