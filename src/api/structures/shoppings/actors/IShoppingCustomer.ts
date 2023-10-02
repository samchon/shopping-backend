import { tags } from "typia";

import { IShoppingChannel } from "../systematic/IShoppingChannel";
import { IShoppingCitizen } from "./IShoppingCitizen";
import { IShoppingExternalUser } from "./IShoppingExternalUser";
import { IShoppingMember } from "./IShoppingMember";

export interface IShoppingCustomer {
    id: string & tags.Format<"uuid">;
    type: "customer";

    channel: IShoppingChannel;
    member: null | IShoppingMember;
    external_user: null | IShoppingExternalUser;
    citizen: null | IShoppingCitizen;

    href: string & tags.Format<"url">;
    referrer: string & tags.Format<"url">;
    ip: string & (tags.Format<"ipv4"> | tags.Format<"ipv6">);

    created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingCustomer {
    export interface IStore {
        channel_code: string;
        external_user: null | IShoppingExternalUser.IStore;
        href: string & tags.Format<"url">;
        referrer: string & tags.Format<"url">;
        ip?: string & (tags.Format<"ipv4"> | tags.Format<"ipv6">);
    }

    export interface IAuthorized extends IShoppingCustomer {
        setHeaders: { "shopping-customer-authorization": string };
        expired_at: string & tags.Format<"date-time">;
    }
}
