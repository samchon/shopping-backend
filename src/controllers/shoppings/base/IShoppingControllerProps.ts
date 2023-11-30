import { ActorPath } from "../../../typings/ActorPath";

export interface IShoppingControllerProps<Path extends ActorPath = ActorPath> {
  AuthGuard: (
    customerLevel?: "guest" | "member" | "citizen",
  ) => ParameterDecorator;
  path: Path;
}
