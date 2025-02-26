import dns from "node:dns";

import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";

import server from "./dist/server/main.js";

dns.setDefaultResultOrder("ipv4first");

const app = new Hono();

app.use(
  "/dist/browser/*",
  cors({ origin: "*", allowMethods: ["HEAD", "GET"] }),
  serveStatic()
);

app.all("*", async (c) => {
  return server.handler(c.req.raw);
});

serve(
  {
    ...app,
    port: 4001,
  },
  (info) => {
    console.log(`RSC listening on http://localhost:${info.port}`);
  }
);
