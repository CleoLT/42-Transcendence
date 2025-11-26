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
  uiConfig: { docExpansion: 'list' }
})

fastify.get("/", async () => {
  return { message: "API running!" };
});


fastify.register(routes)

console.log(fastify.printRoutes());

fastify.listen({ port: 3000, host: "0.0.0.0" });

