import { tags } from "typia";

/**
 * External user information.
 *
 * `IShoppingExternalUser` is an entity dsigned for when this system needs
 * to connect with external services and welcome their users as
 * {@link IShoppingCustomer customers} of this service.
 *
 * For reference, customers who connect from an external service must have
 * this record, and the external service user is identified through the two
 * attributes {@link application} and {@link uid}. If a customer connected
 * from an external service completes
 * {@link IShoppingCitizen real-name authentication} from this service, each
 * time the external service user reconnects to this service and issues a
 * new customer authentication token, real-name authentication begins with
 * completed.
 *
 * And {@link password} is the password issued to the user by the external
 * service system (the so-called permanent user authentication token), and
 * is never the actual user password. However, for customers who entered the
 * same application and uid as the current external system user, this is to
 * determine whether to view this as a correct external system user or a
 * violation.
 *
 * In addition, additional information received from external services can
 * be recorded in the data field in JSON format.
 *
 * @author Samchon
 */
export interface IShoppingExternalUser
  extends Omit<IShoppingExternalUser.ICreate, "password"> {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Creation time of record.
   *
   * Another word, first time when the external user connected.
   */
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingExternalUser {
  /**
   * Creation information of external user.
   */
  export interface ICreate {
    /**
     * Identifier code of the external service.
     *
     * It can be same with {@link IShoppingChannel.code} in common.
     */
    application: string;

    /**
     * Identifier key of external user from the external system.
     */
    uid: string;

    /**
     * Nickname of external user in the external system.
     */
    nickname: string;

    /**
     * Password of external user from the external system.
     *
     * This is a password issued to the user by an external service,
     * and is by no means the actual user password. However, for
     * {@link IShoppingCustomer customers} who entered the same
     * application and code as the current external system user, this is
     * to determine whether to view this as a correct external system
     * user or a violation.
     */
    password: string;

    /**
     * Additional information about external user from the external
     * system.
     */
    data: any;
  }
}
