import { ShoppingGlobal } from "../src/ShoppingGlobal";

export namespace TestGlobal {
  export const CHANNEL = "samchon";
  export const SECTION = "general";
  export const PASSWORD = ShoppingGlobal.env.SHOPPING_SYSTEM_PASSWORD;

  export const HREF = "http://localhost/TestAutomation";
  export const REFERRER = "http://localhost/NodeJS";

  export const compareId = (x: string, y: string) => x.localeCompare(y);
}
