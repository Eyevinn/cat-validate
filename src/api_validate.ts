import { ConsoleLogger, HttpValidator } from '@eyevinn/cat';
import { FastifyPluginCallback } from 'fastify';

export interface ValidateOptions {
  keys: {
    kid: string;
    key: Buffer;
  }[];
  issuer: string;
  redisUrl?: URL;
}

const apiValidate: FastifyPluginCallback<ValidateOptions> = (
  fastify,
  opts,
  next
) => {
  const validator = new HttpValidator({
    keys: opts.keys,
    issuer: opts.issuer,
    autoRenewEnabled: true,
    tokenMandatory: true,
    logger: new ConsoleLogger()
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
