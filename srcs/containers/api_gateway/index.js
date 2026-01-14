import Fastify from "fastify";
import proxy from "@fastify/http-proxy";
import cors from "@fastify/cors"

const app = Fastify({ logger: true });

//Cross-origin ressource sharing para que el front pueda hacer fetch
app.register(cors, {
  origin: "https://localhost:8080",
  methods: ["GET", "POST", "PATCH", "DELETE"]
});

app.register(proxy, {
  upstream: "http://user-service:3000",
  prefix: "/api/users",
  rewritePrefix: "/"
});

app.register(proxy, {
  upstream: "http://auth-service:3000",
  prefix: "/api/auth/",
  rewritePrefix: "/"
});

app.get("/health", async () => ({ ok: true }));

app.listen({ port: 3000, host: "0.0.0.0" });


