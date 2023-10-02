import { IShoppingMember } from "./IShoppingMember";

export interface IShoppingAdministrator extends IShoppingMember {
    type: "administrator";
}
export namespace IShoppingAdministrator {
    import ILogin = IShoppingMember.ILogin;

    export interface IAuthorized extends IShoppingAdministrator {
        setHeaders: {
            "shopping-administrator-authorization": string;
        };
    }

    export interface IStore extends ILogin {
        type: "administrator";
    }
}
