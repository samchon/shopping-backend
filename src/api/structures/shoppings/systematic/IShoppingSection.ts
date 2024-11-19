import { tags } from "typia";

import { IPage } from "../../common/IPage";

/**
 * Section information.
 *
 * `IShoppingSection` is a concept that refers to the spatial information of
 * the market.
 *
 * If we compare the section mentioned here to the offline market, it means a
 * spatially separated area within the store, such as the "fruit corner" or
 * "butcher corner". Therefore, in the {@link IShoppingSale sale} entity, it is
 * not possible to classify multiple sections simultaneously, but only one section
 * can be classified.
 *
 * By the way, if your shopping mall system requires only one section, then just
 * use only one. This concept is designed to be expandable in the future.
 *
 * @author Samchon
 */
export interface IShoppingSection {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Identifier code.
   */
  code: string;

  /**
   * Representative name of the section.
   */
  name: string;

  /**
   * Creation time of record.
   */
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingSection {
  /**
   * Request of the sections with pagination and searching/sorting options.
   */
  export interface IRequest extends IPage.IRequest {
    search?: null | IRequest.ISearch;
    sort?: null | IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export interface ISearch {
      code?: null | string;
      name?: null | string;
    }
    export type SortableColumns =
      | "section.code"
      | "section.name"
      | "section.created_at";
  }

  /**
   * Creation information of the section.
   */
  export interface ICreate {
    /**
     * Identifier code.
     */
    code: string;

    /**
     * Representative name of the section.
     */
    name: string;
  }

  /**
   * Updating information of the section.
   */
  export interface IUpdate {
    /**
     * Representative name of the section.
     */
    name: string;
  }
}
