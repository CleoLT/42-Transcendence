import routes from './routes.js'
import cookie from '@fastify/cookie';
import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.register(cookie);

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