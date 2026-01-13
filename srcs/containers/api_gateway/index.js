import Fastify from "fastify";
import proxy from "@fastify/http-proxy";
import cors from "@fastify/cors"
//import swagger from "@fastify/swagger" 
//import swaggerUI from "@fastify/swagger-ui"
//import userDocs from "./documentation/user.docs.js"

const app = Fastify({ logger: true });

//para que el front pueda hacer fetch
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
  upstream: "http://auth-service:4000",
  prefix: "/api/auth/",
  rewritePrefix: "/"
});
/*app.register(swagger, {
   swagger: {
    openapi: "3.0.0",
    info: {
      title: 'Transcendance API Gateway',
      description: 'Routes documentation for Transcendance project',
      version: '1.0.0'
    },
    paths: {
      ...userDocs.paths
    }
  },
  exposeRoute: true
})


app.register(swaggerUI, {
  routePrefix: '/docs',
  swagger: api,
  uiConfig: { docExpansion: 'list' }
})
*/

app.get("/health", async () => ({ ok: true }));

app.listen({ port: 3000, host: "0.0.0.0" });


