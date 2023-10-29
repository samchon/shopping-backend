import { tags } from "typia";

import { IShoppingSeller } from "../actors/IShoppingSeller";
import { IShoppingSection } from "../systematic/IShoppingSection";
import { IShoppingSale } from "./IShoppingSale";
import { IShoppingSaleChannel } from "./IShoppingSaleChannel";
import { IShoppingSaleContent } from "./IShoppingSaleContent";
import { IShoppingSaleUnit } from "./IShoppingSaleUnit";
import { IShoppingSaleAggregate } from "./aggregates/IShoppingSaleAggregate";

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
    export interface IInvert
        extends IBase<IShoppingSaleContent.IInvert, IShoppingSaleUnit.IInvert>,
            IShoppingSale.ITimestamps {
        section: IShoppingSection;
        seller: IShoppingSeller;
    }

    export interface ISummary
        extends IBase<
            IShoppingSaleContent.ISummary,
            IShoppingSaleUnit.ISummary
        > {}

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
         * Creation time of the record.
         */
        created_at: string & tags.Format<"date-time">;

        /**
         * Description and image content describing the sale.
         */
        content: Content;

        /**
         * List of search tags.
         */
        tags: string[];

        /**
         *
         */
        aggregate: IShoppingSaleAggregate;

        /**
         * List of units.
         *
         * Records about individual product composition informations that are sold
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
        content: IShoppingSaleContent.IStore;
        channels: IShoppingSaleChannel.IStore[];
        units: IShoppingSaleUnit.ICreate[] & tags.MinItems<1>;
        tags: string[];
    }
}
