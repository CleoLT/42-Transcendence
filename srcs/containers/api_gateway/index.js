import Fastify from "fastify";
import proxy from "@fastify/http-proxy";

const app = Fastify({ logger: true });

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

//Health check
app.get("/health", async () => ({ ok: true }));

app.listen({ port: 3000, host: "0.0.0.0" });



// esto para que los status de respuesta sean mas parecidos a una api-gateway
//app.setErrorHandler((err, req, reply) => {
//  if (err.code === 'EAI_AGAIN' || err.code === 'ECONNREFUSED') {
//    reply.code(502).send({ error: "Bad Gateway" });
//  } else {
//    reply.code(500).send({ error: "Internal Server Error" });
//  }
//});


