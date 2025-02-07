import { RandomGenerator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api";

export class ConnectionPool {
  public readonly channel: string;

  public constructor(private readonly connection: ShoppingApi.IConnection) {
    this.customer = clone(connection);
    this.seller = clone(connection);
    this.admin = clone(connection);
    this.channel = RandomGenerator.alphabets(16);
  }

  public readonly customer: ShoppingApi.IConnection;
  public readonly seller: ShoppingApi.IConnection;
  public readonly admin: ShoppingApi.IConnection;

  public generate(): ShoppingApi.IConnection {
    return clone(this.connection);
  }
}

const clone = (
  connection: ShoppingApi.IConnection,
): ShoppingApi.IConnection => ({
  ...connection,
  headers: undefined,
});
