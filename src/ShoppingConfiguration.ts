import { ExceptionManager } from "@nestia/core";
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import fs from "fs";
import path from "path";

import { ShoppingGlobal } from "./ShoppingGlobal";

const EXTENSION = __filename.substr(-2);
if (EXTENSION === "js") require("source-map-support").install();

export namespace ShoppingConfiguration {
  export const ROOT = (() => {
    const splitted: string[] = __dirname.split(path.sep);
    return splitted.at(-1) === "src" && splitted.at(-2) === "bin"
      ? path.resolve(__dirname + "/../..")
      : fs.existsSync(__dirname + "/.env")
      ? __dirname
      : path.resolve(__dirname + "/..");
  })();

  export const API_PORT = () => Number(ShoppingGlobal.env.SHOPPING_API_PORT);
  export const UPDATOR_PORT = () =>
    Number(ShoppingGlobal.env.SHOPPING_UPDATOR_PORT);
  export const MASTER_IP = () =>
    ShoppingGlobal.mode === "local"
      ? "127.0.0.1"
      : ShoppingGlobal.mode === "dev"
      ? "your-dev-server-ip"
      : "your-real-server-master-ip";
  export const SYSTEM_PASSWORD = () =>
    ShoppingGlobal.env.SHOPPING_SYSTEM_PASSWORD;

  export const MILEAGE_REWARDS = {
    PHOTO_REVIEW: 1_000,
    TEXT_REVIEW: 300,
    ORDER_GOOD_CONFIRM_PERCENTAGE: 3,
  };
}

ExceptionManager.insert(PrismaClientKnownRequestError, (exp) => {
  switch (exp.code) {
    case "P2025":
      return new NotFoundException(exp.message);
    case "P2002": // UNIQUE CONSTRAINT
      return new ConflictException(exp.message);
    default:
      return new InternalServerErrorException(exp.message);
  }
});
