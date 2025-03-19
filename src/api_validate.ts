import { ConsoleLogger, HttpValidator, RedisCTIStore } from '@eyevinn/cat';
import { FastifyPluginCallback } from 'fastify';
import { ClickHouseLogger } from './logger/clickhouse';

export interface ValidateOptions {
  keys: {
    kid: string;
    key: Buffer;
  }[];
  issuer: string;
  redisUrl?: string;
  clickHouseUrl?: string;
}

const apiValidate: FastifyPluginCallback<ValidateOptions> = (
  fastify,
  opts,
  next
) => {
  let store;
  let logger;
  if (opts.redisUrl) {
    store = new RedisCTIStore(new URL(opts.redisUrl));
  }
  if (opts.clickHouseUrl) {
    logger = new ClickHouseLogger(new URL(opts.clickHouseUrl));
  } else {
    logger = new ConsoleLogger();
  }
  const validator = new HttpValidator({
    keys: opts.keys,
    issuer: opts.issuer,
    autoRenewEnabled: true,
    tokenMandatory: true,
    store,
    logger
  });

  fastify.addHook('preHandler', async (req, reply) => {
    try {
      const result = await validator.validateHttpRequest(req.raw, reply.raw);
      reply.code(result.status).send(result.message || 'ok');
    } catch (e) {
      reply.code(500).send((e as Error).message);
    }
  });

  fastify.get('/validate', (req, reply) => {
    reply.send();
  });
  next();
};

export default apiValidate;
