import { tags } from "typia";

import { IShoppingChannel } from "../systematic/IShoppingChannel";
import { IShoppingCitizen } from "./IShoppingCitizen";
import { IShoppingExternalUser } from "./IShoppingExternalUser";
import { IShoppingMember } from "./IShoppingMember";

/**
 * Customer information, but not a person but a connection basis.
 *
 * `IShoppingCustomer` is an entity that literally embodies the information of
 * those who participated in the market as customers. By the way, the
 * `IShoppingCustomer` does not mean a person, but a connection basis. Therefore,
 * even if the same person connects to the shopping mall multiple, multiple
 * records are created in `IShoppingCustomer`.
 *
 * The first purpose of this is to track the customer's inflow path in detail,
 * and it is for cases where the same person enters as a non-member,
 * {@link IShoppingCartCommodity puts items in the shopping cart} in advance,
 * and only authenticates their {@link IShoppingCitizen real name} or
 * registers/logs in at the moment of {@link IShoppingOrderPublish payment}.
 * It is the second. Lastly, it is to accurately track the activities that
 * a person performs at the shopping mall in various ways like below.
 *
 * - Same person comes from an {@link IShoppingExternalUser external service}
 * - Same person creates multiple accounts
 * - Same person makes a {@link IShoppingOrderPublish purchase} as a non-member with only {@link IShoppingCitizen real name authentication}
 * - Same person acts both {@link IShoppingSeller seller} and {@link IShoppingAdministrator admin} at the same time
 *
 * Therefore, `IShoppingCustomer` can have multiple records with the same
 * {@link IShoppingCitizen}, {@link IShoppingMember}, and
 * {@link IShoppingExternalUser}. Additionally, if a customer signs up for
 * membership after verifying their real name or signs up for our service after
 * being a user of an external service, all related records are changed at once.
 * Therefore, identification and tracking of customers can be done very
 * systematically.
 *
 * @author Samchon
 */
export interface IShoppingCustomer extends IShoppingCustomer.IInvert {
  /**
   * Discriminant for the type of customer.
   */
  type: "customer";

  /**
   * Membership information.
   *
   * If the customer has joined as a member.
   */
  member: null | IShoppingMember;

  /**
   * Citizen information.
   *
   * If the customer has verified his real name and mobile number.
   */
  citizen: null | IShoppingCitizen;
}
export namespace IShoppingCustomer {
  /**
   * Inverted customer informatino.
   *
   * This inverted customer information has been designed to be used for
   * another invert informations of sellers and administrators like below.
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
     * Belonged channel.
     */
    channel: IShoppingChannel;

    /**
     * External user information.
     *
     * When the customer has come frome an external service.
     */
    external_user: null | IShoppingExternalUser;

    /**
     * Connection address.
     *
     * Same with {@link window.location.href} of client.
     */
    href: string & tags.Format<"uri">;

    /**
     * Referrer address.
     *
     * Same with {@link window.document.referrer} of client.
     */
    referrer: null | (string & tags.Format<"uri">);

    /**
     * Connection IP Address.
     */
    ip: string & (tags.Format<"ipv4"> | tags.Format<"ipv6">);

    /**
     * Creation time of the connection record.
     */
    created_at: string & tags.Format<"date-time">;
  }

  export interface ICreate {
    channel_code: string;
    external_user: null | IShoppingExternalUser.ICreate;
    href: string & tags.Format<"uri">;
    referrer: null | (string & tags.Format<"uri">);
    ip?: string & (tags.Format<"ipv4"> | tags.Format<"ipv6">);
  }

  export interface IAuthorized extends IShoppingCustomer {
    setHeaders: { Authorization: string };
    token: IToken;
  }
  export interface IToken {
    access: string;
    refresh: string;
    expired_at: string & tags.Format<"date-time">;
    refreshable_until: string & tags.Format<"date-time">;
  }
  export interface IRefresh {
    value: string;
  }
}
