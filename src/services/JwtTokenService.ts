import { ErrorProvider } from "../utils/ErrorProvider";
import { JwtTokenManager } from "../utils/TokenManager";

export namespace JwtTokenService {
  export const authorize =
    (table: string) =>
    async (req: {
      headers: { authorization?: string };
    }): Promise<JwtTokenManager.IAsset> => {
      // VALIDATE HEADERS
      if (!req.headers.authorization)
        throw ErrorProvider.unauthorized({
          accessor: "headers.authorization",
          message: "no token value exists",
        });
      else if (req.headers.authorization.startsWith(BEARER_PREFIX) === false)
        throw ErrorProvider.unauthorized({
          accessor: "headers.authorization",
          message: "invalid token",
        });

      // PARSE TOKEN
      try {
        const token: string = req.headers.authorization.substring(
          BEARER_PREFIX.length,
        );
        const asset: JwtTokenManager.IAsset = await JwtTokenManager.verify(
          "access",
        )(token);
        if (!asset)
          throw ErrorProvider.unauthorized({
            accessor: "headers.authorization",
            message: "invalid token",
          });
        else if (asset.table !== table)
          throw ErrorProvider.unauthorized({
            accessor: "headers.authorization",
            message: "invalid token",
          });
        else if (new Date(asset.expired_at).getTime() < Date.now())
          throw ErrorProvider.unauthorized({
            accessor: "headers.authorization",
            message: "expired token",
          });
        return asset;
      } catch {
        throw ErrorProvider.unauthorized({
          accessor: "headers.authorization",
          message: "invalid token",
        });
      }
    };
}

const BEARER_PREFIX: string = "Bearer ";
