import api from './api';
import apiValidate from './api_validate';

const server = api({ title: 'Common Access Token Validator Service' });

let kid = 'Symmetric256';
let key = Buffer.from(
  '403697de87af64611c1d32a05dab0fe1fcb715a86ab435f1ec99192d79569388',
  'hex'
);
if (process.env.KEYS) {
  const [keyId, keyHex] = process.env.KEYS.split(':');
  kid = keyId;
  key = Buffer.from(keyHex, 'hex');
}

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

server.register(apiValidate, {
  keys: [
    {
      kid,
      key
    }
  ],
  issuer: process.env.ISSUER || 'eyevinn',
  redisUrl: process.env.REDIS_URL,
  clickHouseUrl: process.env.CLICKHOUSE_URL
});
server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    throw err;
  }
  console.log(`Server listening on ${address}`);
});

export default server;
