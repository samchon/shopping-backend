import { tags } from "typia";

/**
 * Email address of member.
 *
 * This shopping mall system allows multiple email addresses to be
 * registered for one {@link IShoppingMember member}. If you don't have to
 * plan such multiple email addresses, just use only one.
 *
 * @author Samchon
 */
export interface IShoppingMemberEmail {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Email address value.
   */
  value: string & tags.Format<"email">;

  /**
   * Creation time of record.
   */
  created_at: string & tags.Format<"date-time">;
}
