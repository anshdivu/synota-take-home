import boom from "@hapi/boom";
import { ErrorRequestHandler } from "express";

const handleErrors: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err instanceof boom.Boom) {
    const payload = err.output.payload;
    return res
      .status(payload.statusCode)
      .send({ message: payload.message, input: err.data.input });
  }

  return res
    .status(500)
    .send({ message: err?.message || "Internal Server Error" });
};

export default handleErrors;
