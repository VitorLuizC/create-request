/// <reference lib="dom" />

/**
 * An alias to `window.fetch` type definition.
 */
type Fetch = typeof fetch;

/**
 * Options to do a request (`"url"` + `fetch`'s second argument).
 */
export interface RequestOptions extends RequestInit {
  url: string;
}

/**
 * Interceptors to handle request errors.
 */
export interface ErrorInterceptors {
  /**
   * Handle request and response errors.
   * @param reason - Error reason, almost every time is an `Error` instance.
   */
  onError?: (reason: unknown) => Promise<never>;

  /**
   * Handle request errors. Overwrites `onError` handling request errors.
   * @param reason - Error reason, almost every time is an `Error` instance.
   */
  onRequestError?: (reason: unknown) => Promise<never>;

  /**
   * Handle response errors. Overwrites `onError` handling response errors.
   * @param reason - Error reason, almost every time is an `Error` instance.
   */
  onResponseError?: (reason: unknown) => Promise<never>;
}

/**
 * Interceptors to handle request, response and errors.
 */
export interface RequestInterceptors extends ErrorInterceptors {
  onRequest?: (...params: [RequestOptions]) => RequestOptions;
  onResponse?: (response: Response) => Response | PromiseLike<Response>;
}

/**
 * Apply interceptors to `fetch` and create a custom request function.
 * @param fetch - Yours environment Fetch function.
 * @param interceptors - Interceptors as a kind of protocol to handle requests.
 */
export default function createRequest<A extends any[], R = Response>(
  fetch: Fetch,
  interceptors?: ErrorInterceptors & {
    onRequest: (...params: A) => RequestOptions;
    onResponse: (response: Response) => R | PromiseLike<R>;
  },
): (...params: A) => Promise<R>;

export default function createRequest<A extends any[]>(
  fetch: Fetch,
  interceptors?: ErrorInterceptors & {
    onRequest: (...params: A) => RequestOptions;
  },
): (...params: A) => Promise<Response>;

export default function createRequest<R = Response>(
  fetch: Fetch,
  interceptors?: ErrorInterceptors & {
    onResponse: (response: Response) => R | PromiseLike<R>;
  },
): (...params: [RequestOptions]) => Promise<R>;

export default function createRequest(
  fetch: Fetch,
  interceptors?: RequestInterceptors,
): (...params: [RequestOptions]) => Promise<Response>;

/**
 * Apply interceptors to `fetch` and create a custom request function.
 * @param {Fetch} fetch - Yours environment Fetch function.
 * @param {RequestInterceptors} [interceptors] - Interceptors as a kind of protocol to handle requests.
 */
export default function createRequest(
  fetch: Fetch,
  {
    onError = (reason?: unknown) => Promise.reject(reason),
    onRequest = (options: RequestOptions) => options,
    onRequestError = onError,
    onResponse = (response: Response) => Promise.resolve(response),
    onResponseError = onError,
  }: RequestInterceptors = {},
) {
  return function (): Promise<Response> {
    // `arguments` instead of `...args` to improve performance and reduce
    // bundle size. TS/Babel/Bublé don't need to transpile it.
    const params = (arguments as unknown) as [RequestOptions];

    try {
      // `.apply(null, args)` instead of `(...args)` for same reason as above.
      const options = onRequest.apply(null, params);

      return fetch(options.url, options)
        .then(onResponse)
        .catch(onResponseError);
    } catch (reason) {
      return onRequestError(reason);
    }
  };
}
