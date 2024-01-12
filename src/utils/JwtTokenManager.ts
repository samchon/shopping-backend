import jwt from "jsonwebtoken";

import { ShoppingGlobal } from "../ShoppingGlobal";

export namespace JwtTokenManager {
  export type Type = "access" | "refresh";
  export interface IProps {
    table: string;
    id: string;
    readonly: boolean;
    expired_at?: string;
    refreshable_until?: string;
  }
  export type IAsset = Required<IProps>;
  export interface IOutput extends IAsset {
    access: string;
    refresh: string;
  }

  export const generate = async (props: IProps): Promise<IOutput> => {
    const asset: IAsset = {
      table: props.table,
      id: props.id,
      readonly: props.readonly,
      expired_at:
        props.expired_at ??
        new Date(Date.now() + EXPIRATIONS.ACCESS).toISOString(),
      refreshable_until:
        props.refreshable_until ??
        new Date(Date.now() + EXPIRATIONS.REFRESH).toISOString(),
    };
    const [access, refresh] = [
      ShoppingGlobal.env.SHOPPING_JWT_SECRET_KEY,
      ShoppingGlobal.env.SHOPPING_JWT_REFRESH_KEY,
    ].map((key) => jwt.sign(asset, key));
    return {
      ...asset,
      access,
      refresh,
    };
  };

  export const verify =
    (type: Type) =>
    async (token: string): Promise<IAsset> => {
      return jwt.verify(
        token,
        type === "access"
          ? ShoppingGlobal.env.SHOPPING_JWT_SECRET_KEY
          : ShoppingGlobal.env.SHOPPING_JWT_REFRESH_KEY,
      ) as IAsset;
    };

  export const EXPIRATIONS = {
    ACCESS: 3 * 60 * 60 * 1000,
    REFRESH: 2 * 7 * 24 * 60 * 60 * 1000,
  };
}
