import { CAT } from '@eyevinn/cat';
import { Type, Static } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';

export const GenerateRequest = Type.Object({
  key: Type.Object({
    keyId: Type.String(),
    key: Type.String()
  }),
  alg: Type.String(),
  claims: Type.String()
});
export type GenerateRequst = Static<typeof GenerateRequest>;

const apiGenerate: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.post<{
    Body: GenerateRequst;
    Reply: string;
  }>(
    '/generate',
    {
      schema: {
        body: GenerateRequest,
        response: {
          200: Type.String(),
          400: Type.String()
        }
      }
    },
    async (req, reply) => {
      try {
        const { key, alg, claims } = req.body;
        const json = JSON.parse(claims);
        const keys: { [id: string]: Buffer } = {};

        keys[key.keyId] = Buffer.from(key.key, 'hex');

        const generator = new CAT({ keys, expectCwtTag: true });
        const token = await generator.generateFromJson(json, {
          type: 'mac',
          alg,
          kid: key.keyId,
          generateCwtId: true
        });
        reply.code(200).send(token);
      } catch (err) {
        reply.code(400).send('Invalid request: ' + (err as Error).message);
      }
    }
  );

  next();
};

export default apiGenerate;
