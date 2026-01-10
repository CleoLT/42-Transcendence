import Fastify from "fastify";
import proxy from "@fastify/http-proxy";
import swagger from "@fastify/swagger" 
import swaggerUI from "@fastify/swagger-ui"

const app = Fastify({ logger: true });

app.register(swagger, {
   openapi: {
    openapi: "3.0.0",
    info: {
      title: 'Transcendance API Gateway',
      description: 'Routes documentation with Swagger',
      version: '1.0.0'
    }
  },
  exposeRoute: true
})

app.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: { docExpansion: 'list' }
})

const userDocs = require('./documentation/users.docs')

userDocs.forEach(route => {
  app.route({
    ...route,
    handler: async () => {} // nunca se ejecuta (proxy intercepta)
  })
})


// MOCK REQUEST
// le digo que si viene una request tipo POST al microservicio 'auth' con path '/login', 
// que en vez de redirigirla, me devuelva en formato json una respuesta correcta
app.post("/api/auth/login", async () => {
  return { ok: true, source: "gateway" };
});
// si hubieramos puesto "/api/auth/login/register", NO habria hecho nada porque:
// - Nginx routes by prefix
// - Fastify routes by exact match (unless you use params)


// Sends routes of 'auth' microservice to that container
// so anything that started with "https://localhost:8080/api/auth"
// como pone 'proxy', lo va a redirigir via HTTP a otro servicio/contenedor
app.register(proxy, {
  upstream: "http://auth-service:4000",
  prefix: "/api/auth/"
});

//INFO: el orden de las cosas es superimportante!
//  en cuanto una ruta cuadra exactamente con algo que tengamos aqui escrito,
//  se ejecuta, y no vuelve!
//  es justamente lo que pasa con '/api/auth/login':
//  la "app.register(proxy, ...)", no se ejecuta
//  porque ya ha cuadrado con "app.post"

app.register(proxy, {
  upstream: "http://user-service:3000",
  prefix: "/api/users",
  rewritePrefix: "/"
})



app.get("/health", async () => ({ ok: true }));

app.listen({ port: 3000, host: "0.0.0.0" });


