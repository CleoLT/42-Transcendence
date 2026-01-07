const fastify = require('fastify')({ logger: true })
const swagger = require('@fastify/swagger')
const swaggerUI = require('@fastify/swagger-ui')
const multipart = require('@fastify/multipart')
const static = require('@fastify/static') //for index.html
const path = require('node:path') //for index.html
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
  //attachFieldsToBody: true
});

fastify.register(routes)

fastify.register(swagger, {
   openapi: {
    openapi: "3.0.0",
    info: {
      title: 'Transcendance API',
      description: 'Routes documentation with Swagger',
      version: '1.0.0'
    }
  },
  exposeRoute: true
})


fastify.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: { docExpansion: 'list' }
})

// Servir archivos estáticos desde /public
//fastify.register(static, {
 // root: path.join(__dirname, 'public'),
 // prefix: '/', // la URL base (ej: /index.html)
//});

// Ruta por defecto para servir index.html
//fastify.get('/', async (req, reply) => {
 // return reply.sendFile('index.html'); // archivo dentro de /public
//});

console.log(fastify.printRoutes());

fastify.listen({ port: 3000, host: "0.0.0.0" });

