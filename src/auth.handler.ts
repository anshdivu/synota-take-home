import boom from "@hapi/boom";
import { PrismaClient, User } from "@prisma/client";
import parseBasicAuth, { BasicAuthResult } from "basic-auth";
import crypto from "crypto";
import { RequestHandler } from "express";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

export const basicAuthHandler: (db: PrismaClient) => RequestHandler =
  (db) => async (req, _res, next) => {
    const creds = parseBasicAuth(req);

    if (!creds) {
      return next(boom.unauthorized("Authorization Header Not Found"));
    }

    const user = await findUserByCreds(db, creds);
    if (!user) {
      return next(boom.unauthorized("Invalid Credentials"));
    }

    req.user = user;
    return next();
  };

async function findUserByCreds(db: PrismaClient, creds: BasicAuthResult) {
  const user = await db.user.findFirst({ where: { username: creds.name } });
  if (!user) return undefined;

  const hashedCreds = hashAndSalt(creds.pass, user.salt);
  return hashedCreds.equals(user.hashedPassword) ? user : undefined;
}

export function hashAndSalt(pass: string, salt: Buffer) {
  return crypto.pbkdf2Sync(pass, salt, 310000, 32, "sha256");
}
