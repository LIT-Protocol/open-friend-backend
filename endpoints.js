import { authUser } from "./auth.js";

export default async function (fastify, opts) {
  fastify.put("/friendRequest/create", async (request, reply) => {
    if (!authUser(authSig)) {
      reply.code(400);
      return { error: "Invalid signature" };
    }
  });
}
