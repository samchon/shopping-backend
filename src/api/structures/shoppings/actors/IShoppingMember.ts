import { tags } from "typia";

import { IShoppingAdministrator } from "./IShoppingAdministrator";
import { IShoppingCitizen } from "./IShoppingCitizen";
import { IShoppingMemberEmail } from "./IShoppingMemberEmail";
import { IShoppingSeller } from "./IShoppingSeller";

/**
 * Member Account.
 *
 * `IShoppingMember` is an entity that symbolizes the case when a
 * {@link IShoppingCustomer} signs up as a member of this shopping mall
 * system.
 *
 * If a `IShoppingMember` has seller or administrator property. it means that
 * the {@link IShoppingCustomer} has acting as a {@link IShoppingSeller seller}
 * or {@link IShoppingAdministrator administrator} at the same time.
 *
 * @author Samchon
 */
export interface IShoppingMember extends IShoppingMember.IInvert {
  /**
   * Citizen information.
   *
   * Only when has verified as a citizen, with mobile number and real name.
   *
   * For reference, if the member has signed up as a seller or administrator,
   * this citizen information must be.
   */
  citizen: null | IShoppingCitizen;

  /**
   * Seller information.
   *
   * If the member also signed up as a seller.
   */
  seller: null | IShoppingSeller;

  /**
   * Administrator information.
   *
   * If the member also signed up as an administrator.
   */
  administrator: null | IShoppingAdministrator;
}
export namespace IShoppingMember {
  /**
   * Invert information of member.
   *
   * This invert member information has been designed to be used for another
   * invert informations of sellers and administrators like below.
   *
   * - {@link IShoppingSeller.IInvert}
   * - {@link IShoppingAdministrator.IInvert}
   */
  export interface IInvert {
    /**
     * Primary Key.
     */
    id: string & tags.Format<"uuid">;

    /**
     * Nickname that uniquely identifies the member.
     */
    nickname: string;

    /**
     * List of emails.
     */
    emails: IShoppingMemberEmail[];

    /**
     * Creation time of record.
     *
     * Another words, the time when the member has signed up.
     */
    created_at: string & tags.Format<"date-time">;
  }

  export interface IJoin extends ILogin {
    /**
     * Nickname that uniquely identifies the member.
     */
    nickname: string;

    /**
     * Citizen information.
     */
    citizen: null | IShoppingCitizen.ICreate;
  }
  export interface ILogin {
    email: string & tags.Format<"email">;
    password: string;
  }
  export interface IPasswordChange {
    oldbie: string;
    newbie: string;
  }
  export interface IPasswordReset {
    email: string & tags.Format<"email">;
  }
}
