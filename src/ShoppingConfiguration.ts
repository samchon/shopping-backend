import { ExceptionManager } from "@nestia/core";
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import fs from "fs";
import path from "path";

import { ShoppingGlobal } from "./ShoppingGlobal";
import { Prisma } from "@prisma/client";

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
}

ExceptionManager.insert(Prisma.PrismaClientKnownRequestError, (exp) => {
  switch (exp.code) {
    case "P2025":
      return new NotFoundException(exp.message);
    case "P2002": // UNIQUE CONSTRAINT
      return new ConflictException(exp.message);
    default:
      return new InternalServerErrorException(exp.message);
  }
});
