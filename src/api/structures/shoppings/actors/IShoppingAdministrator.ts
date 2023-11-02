import { tags } from "typia";

import { IShoppingCitizen } from "./IShoppingCitizen";
import { IShoppingCustomer } from "./IShoppingCustomer";
import { IShoppingMember } from "./IShoppingMember";

/**
 * Administrator account.
 *
 * `IShoppingAdministrator` is an entity that embodies a person who manages
 * the shopping mall system, with {@link IShoppingMember membership} joining.
 *
 * For reference, unlike {@link IShoppingCustomer customers} which can participate
 * even without membership joining, administrator must join membership to operate
 * managements. Also, administrator must perform the
 * {@link IShoppingCitizen real-name and mobile authentication}, too.
 *
 * @author Samchon
 */
export interface IShoppingAdministrator {
    /**
     * Primary Key.
     */
    id: string & tags.Format<"uuid">;

    /**
     * Creation time of record.
     *
     * Another words, the time when the administrator has signed up.
     */
    created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingAdministrator {
    /**
     * Invert information starting from administrator info.
     *
     * Instead of accessing to the administrator information from the
     * {@link IShoppingCustomer.member} -> {@link IShoppingMember.administrator},
     * `IShoppingAdministrator.IInvert` starts from the administrator information
     * and access to the customer, member and {@link IShoppingCitizen citizen}
     * informations inversely.
     */
    export interface IInvert extends IShoppingAdministrator {
        /**
         * Discriminant for the type of customer.
         */
        type: "administrator";

        /**
         * Membership joining information.
         */
        member: IShoppingMember.IInvert;

        /**
         * Customer, the connection information.
         */
        customer: IShoppingCustomer.IInvert;

        /**
         * Real-name and mobile number authentication information.
         */
        citizen: IShoppingCitizen;
    }

    export interface IJoin {}
}
