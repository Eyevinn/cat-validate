<h1 align="center">
  Common Access Token Validator
</h1>

<div align="center">
  Common Access Token (CTA-5007) Validator Service
  <br />
</div>

<div align="center">
<br />

[![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=flat-square)](https://github.com/Eyevinn/cat-validator/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
[![made with hearth by Eyevinn](https://img.shields.io/badge/made%20with%20%E2%99%A5%20by-Eyevinn-59cbe8.svg?style=flat-square)](https://github.com/eyevinn)
[![Slack](http://slack.streamingtech.se/badge.svg)](http://slack.streamingtech.se)

</div>

A service for validation of Common Access Tokens (CTA-5007). Based on the `@eyevinn/cat` NPM library.

```bash
% docker run --rm -p 8000:8000 \
  -e KEYS=Symmetric256:403697de87af64611c1d32a05dab0fe1fcb715a86ab435f1ec99192d79569388 \
  eyevinntechnology/cat-validator
Server listening on http://0.0.0.0:8000
```

Now providing a validation endpoint at http://localhost:8000/validate

```bash
% curl -v -H 'CTA-Common-Access-Token: <TOKEN>' http://localhost:8000/validate
< HTTP/1.1 401 Unauthorized
Token has expired
```

This endpoint can now be used as an authentication endpoint for an nginx web server. As an example:

```bash
% docker run -v ./examples/nginx.conf:/etc/nginx/nginx.conf:ro -p 8080:80 -d nginx
```

Above will start an nginx server that will use the validation endpoint to validate that the user is entitles to fetch the resource. We can try this with curl.

```bash
% curl -v -H 'CTA-Common-Access-Token: 0YRDoQEFoQRMU3ltbWV0cmljMjU2eL5kOTAxMDNhNzAxNjc2NTc5NjU3NjY5NmU2ZTAyNjU2YTZmNmU2MTczMDM2MzZmNmU2NTA0MWE2N2RhZDFiYzA2MWE2N2RhZDE0NDE5MDE0M2Q5MDEwM2E0MDAwMjA0Nzc2Mzc0NjEyZDYzNmY2ZDZkNmY2ZTJkNjE2MzYzNjU3MzczMmQ3NDZmNmI2NTZlMDExODc4MDIxODNjMDc1MDJlZDg5ZmRiNmY3NTViNjA5ZjdhMTdkNTY3ODI0M2IyWCBGB5EC1v2MiEiYl/tDzq6Wj9zM8Rn0Vfy5eWQ1G1Aevg==' http://localhost:8080/myfile.txt
```

In response we will get status `401` if the validation endpoint denies access to the `myfile.txt` resource.

### Token store

For storing and counting token usage you provide a URL to a [Redis key/value store](https://app.osaas.io/dashboard/service/valkey-io-valkey).

```bash
% docker run --rm -p 8000:8000 \
  -e KEYS=Symmetric256:403697de87af64611c1d32a05dab0fe1fcb715a86ab435f1ec99192d79569388 \
  -e REDIS_URL=redis://redis:6379
  eyevinntechnology/cat-validator
```

### Token logs

To log all used tokens for usage analysis you provide a URL to a [ClickHouse database server](https://app.osaas.io/dashboard/service/clickhouse-clickhouse).

```bash
% docker run --rm -p 8000:8000 \
  -e KEYS=Symmetric256:403697de87af64611c1d32a05dab0fe1fcb715a86ab435f1ec99192d79569388 \
  -e CLICKHOUSE_URL=https://cat:cat@eyevinnlab-tokenlog.clickhouse-clickhouse.auto.prod.osaas.io \
  eyevinntechnology/cat-validator
```

### Docker Compose

As an example there is a `docker-compose.yml` file that setups a redis store, validator and nginx if you want to quickly try it out locally.

```bash
% docker-compose up -d
```

Generate a sample token

```bash
% npx ts-node examples/generate.ts
0YRDoQEFoQRMU3ltbWV0cmljMjU2eL5kOTAxMDNhNzAxNjc2MzZmNmQ3MDZmNzM2NTAyNjU2YTZmNmU2MTczMDM2MzZmNmU2NTA0MWE2N2RhZTcxMzA2MWE2N2RhZTY5YjE5MDE0M2Q5MDEwM2E0MDAwMjA0Nzc2Mzc0NjEyZDYzNmY2ZDZkNmY2ZTJkNjE2MzYzNjU3MzczMmQ3NDZmNmI2NTZlMDExODc4MDIxODNjMDc1MGU3YTU3NTE0ZGZmZDQ4NTY1OGUyNzIzMmM3Mzc2Y2ZlWCBtTX9h/k/lNZJZTq4xrj5CJtlRjXILgTsQmE8ubTDHtQ==
```

Then try it out with curl

```bash
% curl -v -H 'CTA-Common-Access-Token: 0YRDoQEFoQRMU3ltbWV0cmljMjU2eL5kOTAxMDNhNzAxNjc2MzZmNmQ3MDZmNzM2NTAyNjU2YTZmNmU2MTczMDM2MzZmNmU2NTA0MWE2N2RhZTcxMzA2MWE2N2RhZTY5YjE5MDE0M2Q5MDEwM2E0MDAwMjA0Nzc2Mzc0NjEyZDYzNmY2ZDZkNmY2ZTJkNjE2MzYzNjU3MzczMmQ3NDZmNmI2NTZlMDExODc4MDIxODNjMDc1MGU3YTU3NTE0ZGZmZDQ4NTY1OGUyNzIzMmM3Mzc2Y2ZlWCBtTX9h/k/lNZJZTq4xrj5CJtlRjXILgTsQmE8ubTDHtQ==' http://localhost:8080/myfile.txt
```

## Requirements

- Node version 22+

## Installation / Usage

```bash
% npm install
```

## Development

```bash
% npm start
> @eyevinn/typescript-nodejs@1.0.0 start
> ts-node -T src/server.ts
Server listening on http://0.0.0.0:8000
{"cti":"3c8997cc6b837b49a5d63e23f910f052","timestamp":1742393865415,"iat":1742393858,"exp":1742393978,"sub":"jonas"}
```

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md)

## License

This project is licensed under the MIT License, see [LICENSE](LICENSE).

# Support

Join our [community on Slack](http://slack.streamingtech.se) where you can post any questions regarding any of our open source projects. Eyevinn's consulting business can also offer you:

- Further development of this component
- Customization and integration of this component into your platform
- Support and maintenance agreement

Contact [sales@eyevinn.se](mailto:sales@eyevinn.se) if you are interested.

# About Eyevinn Technology

[Eyevinn Technology](https://www.eyevinntechnology.se) is an independent consultant firm specialized in video and streaming. Independent in a way that we are not commercially tied to any platform or technology vendor. As our way to innovate and push the industry forward we develop proof-of-concepts and tools. The things we learn and the code we write we share with the industry in [blogs](https://dev.to/video) and by open sourcing the code we have written.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!
