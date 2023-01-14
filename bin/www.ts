#!/usr/bin/env node

import http from "http";
import app from "../src/app";

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT ?? "5000");
app.set("port", port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string): any {
  const parsedPort = parseInt(val, 10);

  if (isNaN(parsedPort)) return val;
  if (parsedPort >= 0) return parsedPort;

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any): void {
  if (error.syscall !== "listen") {
    throw error;
  }
  let bind;
  switch (typeof port) {
    case "string":
      bind = `Pipe ${String(port)}`;
      break;
    case "number":
      bind = `Port ${String(port)}`;
      break;
    case "boolean":
      bind = "Invalid port";
      break;
    default:
      throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  const addr = server.address();

  if (!addr) return;

  const bind =
    typeof addr === "string"
      ? `pipe ${String(addr)}`
      : `port ${Number(addr.port)}`;
  console.log("Server Listening on " + bind);
}
