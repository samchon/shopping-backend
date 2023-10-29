import { tags } from "typia";

/**
 * The address information.
 *
 * @author Samchon
 */
export interface IShoppingAddress extends IShoppingAddress.ICreate {
    /**
     * Primary Key.
     */
    id: string & tags.Format<"uuid">;

    /**
     * Creation time of record.
     */
    created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingAddress {
    export interface ICreate {
        /**
         * Mobile number to contact.
         */
        mobile: string & tags.Pattern<"^[0-9]*$">;

        /**
         * Representative name of the address.
         *
         * Sometimes be receiver's name, and sometimes be place name.
         */
        name: string;

        /**
         * Country name.
         */
        country: string;

        /**
         * Province name.
         */
        province: string;

        /**
         * City name.
         */
        city: string;

        /**
         * Department name.
         */
        department: string;

        /**
         * Detailed address containing street name, building number, and room number.
         */
        possession: string;

        /**
         * Zip code, or postal code.
         */
        zip_code: string;

        /**
         * Special description if required.
         */
        special_note: null | string;
    }
}
