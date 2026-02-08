import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

const fastify = Fastify({
  logger: true,
});

const PORT = process.env.PORT || 3000;

// SWAGGER SETUP (no routes documented yet)
await fastify.register(swagger, {
  swagger: {
    info: {
      title: 'Game History Service',
      description: 'API for game history microservice',
      version: '1.0.0',
    },
  },
});

await fastify.register(swaggerUI, {
  routePrefix: '/docs',
});


// Health check
fastify.get('/health', async () => {
  return { status: 'ok', service: 'game_history' };
});

const start = async () => {
  try {
    await fastify.listen({
      port: PORT,
      host: '0.0.0.0',
    });
    console.log(`Game History service running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();