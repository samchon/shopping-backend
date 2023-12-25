import { tags } from "typia";

/**
 * Option choice information for the final stock added to the shopping cart.
 *
 * `IShoppingCartCommodityStockChoice` is a subsidiary entity of
 * {@link IShoppingCartCommodityStock}. It records which
 * {@link IShoppingSaleUnitOption options} the customer specifically used while
 * putting a specific {@link IShoppingSaleUnit unit} and specific
 * {@link IShoppingSaleUnitStock stock} of the {@link IShoppingSaleSnapshot} in
 * the shopping cart, and which
 * {@link IShoppingSaleUnitStockCandidate candidate values} were selected or
 * written within the shopping cart.
 *
 * Therefore, `IShoppingCartCommodityStockChoice` has reference properties and
 * predicate properties for candidate values in addition to references to options.
 * If the type of target option is "select", enter the candidate value selected by
 * the customer. Otherwise, enter the value written by the customer.
 *
 * @author Samchon
 */
export namespace IShoppingCartCommodityStockChoice {
  /**
   * Creation information of the choice for each option.
   *
   * When record being created, its corresponding structure would be
   * {@link IShoppingSaleUnitStockChoice.IInvert}.
   */
  export interface ICreate {
    /**
     * Target option's {@link IShoppingSaleUnitOption.id}.
     */
    option_id: string & tags.Format<"uuid">;

    /**
     * Target candidate's {@link IShoppingSaleUnitOptionCandidate.id}.
     *
     * When target option's type is `select`, then this attribute is not
     * `null` but has a value.
     */
    candidate_id: null | (string & tags.Format<"uuid">);

    /**
     * Written value about the option.
     *
     * When target option's type is not `select`, but an atomic type value
     * like `boolean`, `number` or `string`, then this attribute is not
     * `null` but has the matched atomic value.
     */
    value: null | boolean | number | string;
  }
}
