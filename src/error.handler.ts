import boom from "@hapi/boom";
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let response = {
    message: err?.message || "Internal Server Error",
    input: undefined,
  };

  if (err instanceof boom.Boom) {
    const payload = err.output.payload;
    statusCode = payload.statusCode;
    response = { message: payload.message, input: err.data?.input };
  }

  if (statusCode >= 500) console.error(err);
  return res.status(statusCode).send(response);
};
