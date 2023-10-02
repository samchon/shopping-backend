import { tags } from "typia";

import { IShoppingCitizen } from "./IShoppingCitizen";
import { IShoppingMemberEmail } from "./IShoppingMemberEmail";

export interface IShoppingMember {
    id: string & tags.Format<"uuid">;
    citizen: null | IShoppingCitizen;
    emails: IShoppingMemberEmail[] & tags.MinItems<1>;
    nickname: string;
    created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingMember {
    export interface IStore extends ILogin {
        nickname: string;
        citizen: null | IShoppingCitizen.IStore;
    }

    export interface ILogin {
        email: string & tags.Format<"email">;
        password: string;
    }

    export interface IPasswordChange {
        oldbie: string;
        newbie: string;
    }
}
