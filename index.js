import Fastify from "fastify";
import fastifyPostgres from "fastify-postgres";
import fastifyCors from "fastify-cors";
import fastifyObjectionJS from "fastify-objectionjs";

import fastifyCookie from "fastify-cookie";
import { connectDiscordBot } from "./discordBot.js";
import knexConfig from "./knexfile.js";

import TokenHolding from "./models/TokenHolding.js";
import User from "./models/User.js";

import Bugsnag from "@bugsnag/js";

import endpoints from "./endpoints.js";

Bugsnag.start({
  apiKey: "5bb84987aed440b2bc30c9dd4441f7b0",
  releaseStage: process.env.LIT_OPEN_FRIEND_BACKEND_ENVIRONMENT,
});

const fastify = Fastify();

connectDiscordBot(fastify);

const dbConfig = {
  connectionString: process.env.LIT_OPEN_FRIEND_BACKEND_DB_URL,
};

let USING_HTTPS = false;
if (
  process.env.LIT_OPEN_FRIEND_BACKEND_ENVIRONMENT === "production" ||
  process.env.LIT_OPEN_FRIEND_BACKEND_ENVIRONMENT === "development"
) {
  USING_HTTPS = true;
}

if (USING_HTTPS) {
  dbConfig.ssl = { rejectUnauthorized: false };
}

fastify.register(fastifyPostgres, dbConfig);

fastify.register(fastifyObjectionJS, {
  knexConfig: knexConfig[process.env.NODE_ENV || "development"],
  models: [TokenHolding, User],
});

fastify.register(fastifyCors, {
  origin: "*",
  methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
  credentials: true,
});

fastify.setErrorHandler((error, request, reply) => {
  console.log("Fastify error: ", error);
  if (process.env.LIT_OPEN_FRIEND_BACKEND_ENVIRONMENT !== "local") {
    Bugsnag.notify(error);
  }
  reply.send({ error });
});

// endpoints
fastify.register(endpoints);

fastify.listen(process.env.PORT || 6000, "0.0.0.0", (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
