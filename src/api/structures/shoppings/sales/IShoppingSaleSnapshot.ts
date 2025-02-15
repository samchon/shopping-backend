import { tags } from "typia";

import { IShoppingSeller } from "../actors/IShoppingSeller";
import { IShoppingChannelCategory } from "../systematic/IShoppingChannelCategory";
import { IShoppingSection } from "../systematic/IShoppingSection";
import { IShoppingSale } from "./IShoppingSale";
import { IShoppingSaleContent } from "./IShoppingSaleContent";
import { IShoppingSalePriceRange } from "./IShoppingSalePriceRange";
import { IShoppingSaleUnit } from "./IShoppingSaleUnit";

/**
 * Snapshot record of sale.
 *
 * `IShoppingSaleSnapshot` is an entity that embodies a snapshot of a sale,
 * and the ERD (Entity Relationship Diagram) describes the role of the
 * `shopping_sale_snapshots` table as follows:
 *
 * > {@link IShoppingSale shopping_sales} is an entity that embodies
 * > "product sales" (sales) information registered by the
 * > {@link IShoppingSeller seller}. And the main information of the sale is
 * > recorded in the sub `shopping_sale_snapshots`, not in the main
 * > {@link IShoppingSale shopping_sales}. When a seller changes a previously
 * > registered item, the existing {@link IShoppingSale shopping_sales} record
 * > is not changed, but a new snapshot record is created.
 * >
 * > This is to preserve the {@link IShoppingCustomer customer}'s
 * > {@link IShoppingOrder purchase history} flawlessly after the customer
 * > purchases a specific item, even if the seller changes the components or price
 * > of the item. It is also intended to support sellers in so-called A/B testing,
 * > which involves changing components or prices and measuring the performance
 * > in each case.
 *
 * By the way, DTO (Data Transfer Object) level used by the front-end developer,
 * it does not distinguish {@link IShoppingSale} and `IShoppingSaleSnapshot`
 * strictly, and generally handles {@link IShoppingSale} and snapshot together.
 *
 * But even though the DTO level does not strictly distinguish them, the word and
 * concept of "snapshot" is still important, so it is recommended to understand
 * the concept of "snapshot" properly.
 *
 * @author Samchon
 */
export interface IShoppingSaleSnapshot
  extends IShoppingSaleSnapshot.IBase<
    IShoppingSaleContent,
    IShoppingSaleUnit
  > {}
export namespace IShoppingSaleSnapshot {
  /**
   * Invert information of the sale snapshot, in the perspective of commodity.
   *
   * `IShoppingSaleSnapshot.IInvert` is a structure used to represent a
   * snapshot in the perspective of a {@link IShoppingCommodity}, corresponding
   * to an {@link IShoppingCartCommodityStock} entity.
   *
   * Therefore, `IShoppingSaleSnapshot.IInvert` does not contain every
   * {@link IShoppingSaleUnit units} and {@link IShoppingSaleUnitStock stocks}
   * of the snapshot records, but only some of the records which are put
   * into the {@link IShoppingCartCommodity shopping cart}.
   */
  export interface IInvert
    extends IBase<IShoppingSaleContent.IInvert, IShoppingSaleUnit.IInvert>,
      IShoppingSale.ITimestamps {
    /**
     * Belonged section's information.
     */
    section: IShoppingSection;

    /**
     * Seller who've registered the sale.
     */
    seller: IShoppingSeller.IInvert;
  }

  /**
   * Summarized information of the sale snapshot.
   */
  export interface ISummary
    extends IBase<IShoppingSaleContent.ISummary, IShoppingSaleUnit.ISummary> {
    /**
     * Price range of the unit.
     */
    price_range: IShoppingSalePriceRange;
  }

  export interface IBase<Content, Unit> {
    /**
     * Primary Key of Sale.
     */
    id: string & tags.Format<"uuid">;

    /**
     * Primary Key of Snapshot.
     */
    snapshot_id: string & tags.Format<"uuid">;

    /**
     * Whether the snapshot is the latest one or not.
     */
    latest: boolean;

    /**
     * Description and image content describing the sale.
     */
    content: Content;

    /**
     * List of categories.
     *
     * Which categories the sale is registered to.
     */
    categories: IShoppingChannelCategory.IInvert[];

    /**
     * List of search tags.
     */
    tags: string[];

    // /**
    //  * Aggregation of business performance.
    //  */
    // aggregate: Omit<IShoppingBusinessAggregate, "sale">;

    /**
     * List of units.
     *
     * Records about individual product composition information that are sold
     * in the sale. Each {@link IShoppingSaleUnit unit} record has configurable
     * {@link IShoppingSaleUnitOption options},
     * {@link IShoppingSaleUnitOptionCandidate candidate} values for each
     * option, and {@link IShoppingSaleUnitStock final stocks} determined by
     * selecting every candidate values of each option.
     */
    units: Unit[] & tags.MinItems<1>;
  }

  /**
   * Creation information of the snapshot.
   */
  export interface ICreate {
    /**
     * Description and image content describing the sale.
     */
    content: IShoppingSaleContent.ICreate;

    /**
     * List of units.
     */
    units: IShoppingSaleUnit.ICreate[] & tags.MinItems<1>;

    /**
     * List of search tags.
     */
    tags: string[];

    /**
     * List of target categories' {@link IShoppingChannelCategory.code}s.
     *
     * If empty, it means all categories of the channel is listing the sale.
     */
    category_codes: Array<string>;
  }
}
