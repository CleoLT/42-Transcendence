const fastify = require('fastify')({ logger: true })
const swagger = require('@fastify/swagger')
const swaggerUI = require('@fastify/swagger-ui')
const db = require('./db')
const routes = require('./routes')

fastify.register(swagger, {
   openapi: {
    info: {
      title: 'Transcendance API',
      description: 'Routes documentation with Swagger',
      version: '1.0.0'
    }
  }
})

fastify.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: { docExpansion: 'full' }
})

fastify.get("/", async () => {
  return { message: "API running!" };
});

// Ejemplo: obtener todos los usuarios
/*fastify.get('/users', (req, reply) => {
  const stmt = db.prepare('SELECT * FROM users');
  const users = stmt.all();
  reply.send(users);
});*/

fastify.register(routes)


// Ejemplo: crear usuario
fastify.post('/users', (req, reply) => {
  const { username, password } = req.body;

  const insert = db.prepare(`
    INSERT INTO users (username, password)
    VALUES (?, ?)
  `);
  const result = insert.run(username, password);
  reply.send({ id: result.lastInsertRowid, username });
});



console.log(fastify.printRoutes());

fastify.listen({ port: 3000, host: "0.0.0.0" });

