/**
 * @packageDocumentation
 * @module api.functional.shoppings.customers.authenticate.password
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection } from "@nestia/fetcher";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";

import type { IShoppingMember } from "../../../../../structures/shoppings/actors/IShoppingMember";

/**
 * Change password.
 *
 * Change password of {@link IShoppingMember member} with the current password.
 *
 * The reason why the current password is required is for security.
 *
 * @param input New password and current password
 * @tag Authenticate
 * @author Samchon
 *
 * @controller ShoppingCustomerAuthenticatePasswordController.change
 * @path PUT /shoppings/customers/authenticate/password/change
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function change(
  connection: IConnection,
  input: change.Body,
): Promise<void> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...connection.headers,
        "Content-Type": "application/json",
      },
    },
    {
      ...change.METADATA,
      template: change.METADATA.path,
      path: change.path(),
    },
    input,
  );
}
export namespace change {
  export type Body = IShoppingMember.IPasswordChange;

  export const METADATA = {
    method: "PUT",
    path: "/shoppings/customers/authenticate/password/change",
    request: {
      type: "application/json",
      encrypted: false,
    },
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: 200,
  } as const;

  export const path = () => "/shoppings/customers/authenticate/password/change";
}
