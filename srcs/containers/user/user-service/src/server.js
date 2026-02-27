import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import multipart from '@fastify/multipart'
import cookie from '@fastify/cookie';
import routes from './routes.js'
import seed from './seedUsers.js'
import db from './db.js'
import fs from 'fs';

const fastify = Fastify({
  logger: true,
  https: {
    key: fs.readFileSync('/certs/user-service.key'),
    cert: fs.readFileSync('/certs/user-service.crt')
  },
  ajv: {
    customOptions: {
      strict: true,
      allErrors: true,
      removeAdditional: false
    }
  }
})

fastify.register(cookie);

//si hay un error no encontrado fastify devuelve 500 por defecto
fastify.setErrorHandler((err, req, reply) => {
  reply.code(err.statusCode || 500).send({
    statusCode: err.statusCode || 500,
    error: err.name || "Internal Server Error",
    message: err.message
  })
})

await fastify.register(multipart, {
  limits: { fileSize: 10 * 1024 * 1024 }
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

await seed()

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


