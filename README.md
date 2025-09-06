# Pushover SDK

A TypeScript SDK for calling [Pushover APIs](https://pushover.net/api) from any JavaScript runtime with fully typed inputs and responses.

[Documentation](https://pushover-sdk.pages.dev) - [GitHub](https://github.com/DallasHoff/pushover-sdk) - [NPM](https://www.npmjs.com/package/pushover-sdk)

## Features

- 📲 Get push notifications from your JavaScript or TypeScript app
- ⚙️ Supports Node.js, Deno, Bun, Cloudflare Workers... anything with the standard Fetch API
- 🔋 Fully supports the entire Pushover API, including Receipts, Glances, Groups, and Teams
- 🛠️ Every method has TypeScript types for the arguments each endpoint takes and what it returns
- 🤝 Works with ESM and CommonJS codebases
- ⚡️ Tiny: no dependencies

## Examples

```typescript
import { Pushover } from 'pushover-sdk';

const pushover = new Pushover({
	token: 'egn0tactva1lyarea1t0k3n',
	user: 's0mepush0v3rus3rid',
});

await pushover.sendMessage('This is a push notification!');

await pushover.sendMessage({
	title: 'Hello World',
	message: 'This notification has a title and link.',
	url: 'https://example.com/',
});

await pushover.updateGlances({
	text: 'Update a Glance',
	percent: 75,
});
```

## Install

```sh
npm install pushover-sdk
# or...
yarn add pushover-sdk
# or...
pnpm install pushover-sdk
# or...
bun add pushover-sdk
```
