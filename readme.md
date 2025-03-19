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



## Requirements

<!--Add any external project dependencies such as node.js version etc here -->

## Installation / Usage

<!--Add clear instructions on how to use the project here -->

## Development

<!--Add clear instructions on how to start development of the project here -->

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
