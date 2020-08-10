# `@bitty/create-request`

![License](https://badgen.net/github/license/VitorLuizC/create-request)
![Library minified size](https://badgen.net/bundlephobia/min/@bitty/create-request)
![Library minified + gzipped size](https://badgen.net/bundlephobia/minzip/@bitty/create-request)

Apply interceptors to `fetch` and create a custom request function.

- :zap: Dependency free and pretty small, **0.3KB** (minified + gzipped);
- :label: Well type defined with TypeScript (with _generics_);
- :package: There are ESM, CommonJS and UMD distributions;

## Installation

This library is published in the NPM registry and can be installed using any compatible package manager.

```sh
npm install @bitty/create-request --save

# Use the command below if you're using Yarn.
yarn add @bitty/create-request
```

## Usage

`@bitty/create-request` is curry function, which applies interceptors to `fetch` and returns a new request function.

```ts
import createRequest from '@bitty/create-request';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const request = createRequest(window.fetch, {
  onRequest: (method: Method, route: string, data: any = undefined) => ({
    url: 'https://api.example.com' + route,
    body: JSON.stringify(data),
    method,
    headers: { 'Content-Type': 'application/json' }
  }),
  onResponse: (response: Response) => {
    if (response.status === 403)
      throw new Error('Authorization error.');
    return response.json();
  },
  onError: (error:? Error) => {
    sentry.captureException(error);
    return Promise.reject(message);
  }
});

request('POST', '/user', {
  name: 'Vitor'
})
  .then((response) => response.success && alert('User was created!'));
```

### Interceptors

- **`onError`**

  ```ts
  onError?: (reason?: Error) => Promise<never>;
  ```

  Handle request and response errors.

- **`onRequest`**

  ```ts
  onRequest?: <A extends any[] = [RequestOptions]>(...params: A) => RequestOptions;
  ```

  Handle request and define request arguments. `A` generic type defines returned `request` function arguments type.

  ![`onRequest` GIF](https://user-images.githubusercontent.com/9027363/50517033-52f98580-0a95-11e9-9deb-0f63e9f56dbf.gif)

- **`onRequestError`**

  ```ts
  onRequestError?: (reason?: Error) => Promise<never>;
  ```

  Handle request errors. Overwrites `onError` handling request errors.

- **`onResponse`**

  ```ts
  onResponse?: <R = Response>(response: R) => R | PromiseLike<R>;
  ```

  Handle response and define the request return. `R` generic type defines returned `request` function result type.

  ![`onResponse` GIF](https://user-images.githubusercontent.com/9027363/50516780-e92cac00-0a93-11e9-963f-c59095af655a.gif)

- **`onResponseError`**

  ```ts
  onResponseError?: (reason?: Error) => Promise<never>;
  ```

  Handle response errors. Overwrites `onError` handling response errors.

### Usage on unsupported browsers

[Do I support `fetch`?](https://caniuse.com/#feat=fetch)

Older browsers don't support `Fetch API`, but you can use [`unfetch`](https://github.com/developit/unfetch) or other polyfill to achieve it.

```js
import fetch from 'unfetch';
import createRequest from '@bitty/create-request';

export default createRequest(fetch, {
  onRequest: (options) => ({
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json'
    }
  }),
  onResponse: (response) => response.json()
});
```

### Usage on Node.js

Node environment does not provide global `fetch` function, but you can use [`node-fetch`](https://github.com/bitinn/node-fetch) to achieve it.

```js
const fetch = require('node-fetch');
const createRequest = require('@bitty/create-request');

module.exports = createRequest(fetch, {
  onResponse (response) {
    return response.json();
  }
});
```

## License

Released under [MIT License](./LICENSE).
