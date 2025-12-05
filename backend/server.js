const fastify = require('fastify')({ logger: true })
const swagger = require('@fastify/swagger')
const swaggerUI = require('@fastify/swagger-ui')
const multipart = require('@fastify/multipart')
const routes = require('./routes')

fastify.register(multipart, {
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 100,     // Max field value size in bytes
    fields: 10,         // Max number of non-file fields
    fileSize: 1000000,  // For multipart forms, the max file size in bytes
    files: 1,           // Max number of file fields
    headerPairs: 2000,  // Max number of header key=>value pairs
    parts: 1000         // For multipart forms, the max number of parts (fields + files)
  }//,
 // attachFieldsToBody: true
});

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

