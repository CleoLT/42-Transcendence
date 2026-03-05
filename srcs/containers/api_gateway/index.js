import Fastify from "fastify";
import proxy from "@fastify/http-proxy";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import fs from 'fs';

const app = Fastify({ 
  logger: true, 
  trustProxy: true,
  https: {
    key: fs.readFileSync('/certs/api_gateway.key'),
    cert: fs.readFileSync('/certs/api_gateway.crt')
  }
});
// la opcion 'logger: true' muestra logs de incoming requests, redirecciones y codigos de respuesta 
// la opcion 'trustproxy: true' confia que el proxy(nginx o vite) viene con https

function readSecret(path) {
  return fs.readFileSync(path, 'utf8').trim()
}

app.register(rateLimit, {
  max: 300,               
  timeWindow: "1 minute",
});

app.addHook('onRequest', async (req) => {
  console.log(`[GATEWAY] ${req.method} ${req.url}`);
});
// printf para ver la request en los logs de la api-gateway

const internalHttpsOptions = {
  rejectUnauthorized: true,
  ca: fs.readFileSync('/certs/ca.crt')
};

app.register(proxy, {
  upstream: "https://user-service:3000",
  prefix: "/api/users",
  rewritePrefix: "/",
  preHandler: async (request, reply) => {
    request.headers['x-api-key'] = readSecret(process.env.API_KEY);
  },
  rewritePrefix: "/",
  https: internalHttpsOptions
});

app.register(proxy, {
  upstream: "https://user-service:3000",
  prefix: "/uploads",
  rewritePrefix: "/uploads",
  preHandler: async (request, reply) => {
    request.headers['x-api-key'] = readSecret(process.env.API_KEY);
  },
  https: internalHttpsOptions
});

app.register(proxy, {
  upstream: "https://auth-service:3000",
  prefix: "/api/auth/",
  rewritePrefix: "/",
  https: internalHttpsOptions
});

app.get("/api/health", async () => {
  return { ok: "service api_gateway is running" };});

app.listen({ port: 3000, host: "0.0.0.0" });