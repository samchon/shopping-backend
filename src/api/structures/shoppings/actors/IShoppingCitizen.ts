import { tags } from "typia";

/**
 * Citizen verification information.
 *
 * `IShoppingCitizen` is an entity that records the user's
 * {@link name real name} and {@link mobile} input information.
 *
 * For reference, in South Korea, real name authentication is required for
 * e-commerce participants, so the name attribute is important. However, the
 * situation is different overseas, so in reality, mobile attributes are the
 * most important, and identification of individual person is also done based
 * on this mobile.
 *
 * Of course, real name and mobile phone authentication information are
 * encrypted and stored.
 *
 * @author Samchon
 */
export interface IShoppingCitizen extends IShoppingCitizen.ICreate {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Creation time of record.
   */
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingCitizen {
  /**
   * Creation information of citizen verification.
   */
  export interface ICreate {
    /**
     * Mobile number.
     */
    mobile: string & tags.Pattern<"^[0-9]*$">;

    /**
     * Real name, or equivalent nickname.
     */
    name: string;
  }
}
