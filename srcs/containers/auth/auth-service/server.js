import routes from './routes.js'
import cookie from '@fastify/cookie';
import Fastify from 'fastify';
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

const fastify = Fastify({ logger: true });

fastify.register(cookie);

fastify.register(swagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: 'Auth Service API',
      description: 'Routes documentation with Swagger for Auth Service',
      version: '1.0.0'
    },
    servers: [{
      url: "/api/auth"
    }]
  },
  exposeRoute: true
});

fastify.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: { docExpansion: 'list' }
});

fastify.register(routes)

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', service: 'auth-service' };
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