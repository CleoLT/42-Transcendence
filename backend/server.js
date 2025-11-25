const fastify = require('fastify')({ logger: true });
const db = require('./db')

fastify.get("/", async () => {
  return { message: "API running!" };
});

// Ejemplo: obtener todos los usuarios
fastify.get('/users', (req, reply) => {
  const stmt = db.prepare('SELECT * FROM users');
  const users = stmt.all();
  reply.send(users);
});

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

