import Fastify from "fastify";
import proxy from "@fastify/http-proxy";
import cors from "@fastify/cors"

const app = Fastify({ 
  logger: true, 
  trustProxy: true
});
// la opcion 'logger: true' muestra logs de incoming requests, redirecciones y codigos de respuesta 
// la opcion 'trustproxy: true' confia que el proxy(nginx o vite) viene con https


// 🔐 HTTPS enforcement
//app.addHook('onRequest', async (req, reply) => {
//  if (req.protocol !== 'https') {
 //   reply.code(400).send({ error: 'HTTPS required' });
  //}
//});


// printf para ver la request en los logs de la api-gateway
app.addHook('onRequest', async (req) => {
  console.log(`[GATEWAY] ${req.method} ${req.url}`);
});


//Cross-origin ressource sharing para que el front pueda hacer fetch
app.register(cors, {
  origin: "https://localhost:8080",
  methods: ["GET", "POST", "PATCH", "DELETE"]
});

//const allowedOrigins = [
//  "http://localhost:5173", // dev frontend (Vite)
//  "https://localhost:8080", // prod frontend (nginx)
//];

//app.register(cors, {
//  origin: (origin, cb) => {
//    // allow requests with no origin (like curl or mobile apps)
//    if (!origin) return cb(null, true);
//    if (allowedOrigins.includes(origin)) {
//      cb(null, true);
//    } else {
//      cb(new Error("Not allowed by CORS"));
//    }
//  },
//  methods: ["GET", "POST", "PATCH", "DELETE"],
//  credentials: true // if you plan to use cookies/auth
//});

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

app.register(proxy, {
  upstream: "http://game_history-service:3000",
  prefix: "/api/game_history/",
  rewritePrefix: "/"
});

app.get("/health", async () => ({ ok: true }));

app.listen({ port: 3000, host: "0.0.0.0" });


