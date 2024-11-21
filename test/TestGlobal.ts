import { ShoppingGlobal } from "../src/ShoppingGlobal";

export namespace TestGlobal {
  export const CHANNEL = "samchon";
  export const SECTION = "general";
  export const PASSWORD = ShoppingGlobal.env.SHOPPING_SYSTEM_PASSWORD;

  export const HREF = "http://127.0.0.1/TestAutomation";
  export const REFERRER = "http://127.0.0.1/NodeJS";

  export const compareId = (x: string, y: string) => x.localeCompare(y);
}
