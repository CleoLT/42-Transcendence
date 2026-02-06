import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import multipart from '@fastify/multipart'
import jwt from '@fastify/jwt';
import routes from './routes.js'

const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      strict: true,
      allErrors: true,
      removeAdditional: false
    }
  }
})

//si hay un error no encontrado fastify devuelve 500 por defecto
fastify.setErrorHandler((err, req, reply) => {
  reply.code(err.statusCode || 500).send({
    statusCode: err.statusCode || 500,
    error: err.name || "Internal Server Error",
    message: err.message
  })
})

fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: 'access_token',
    signed: false
  }
});

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

fastify.register(swagger, {
   openapi: {
    openapi: "3.0.0",
    info: {
      title: 'Transcendance API',
      description: 'Routes documentation with Swagger',
      version: '1.0.0'
    },
    servers: [{
      url: "/api/users"
    }]
  },
  exposeRoute: true
})

fastify.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: { docExpansion: 'list' }
})

fastify.register(routes)

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', service: 'user-service' };
});


// Check to avoid leaving sockets open with nodemon
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

// fastify.listen({ port: 3000, host: "0.0.0.0" });
