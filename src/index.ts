type Fetch = typeof window.fetch;

export type RequestOptions = RequestInit & { url: string; };

export type RequestInterceptors = {
  onError?: (reason?: Error) => Promise<never>,
  onRequestError?: (reason?: Error) => Promise<never>,
  onResponseError?: (reason?: Error) => Promise<never>
};

const createRequest: {
  <R = Response> (
    fetch: Fetch, interceptors?: RequestInterceptors & {
      onResponse: (response: Response) => R | PromiseLike<R>
    }
  ): (...params: [RequestOptions]) => Promise<R>;
  <A extends any[]> (
    fetch: Fetch, interceptors?: RequestInterceptors & {
      onRequest: (...params: A) => RequestOptions
    }
  ): (...params: A) => Promise<Response>;
  <A extends any[], R = Response> (
    fetch: Fetch, interceptors?: RequestInterceptors & {
      onRequest: (...params: A) => RequestOptions,
      onResponse: (response: Response) => R | PromiseLike<R>
    }
  ): (...params: A) => Promise<R>;
} = (
  fetch: Fetch, {
    onError = (reason) => Promise.reject(reason),
    onRequest = (...params: [RequestOptions]) => params[0],
    onRequestError = onError,
    onResponse = (response): Promise<Response> => Promise.resolve(response),
    onResponseError = onError
  } = {}
) => (...params: [RequestOptions]): Promise<Response> => {
  try {
    const { url, ...options } = onRequest(...params);
    return (
      fetch(url, options)
        .then(onResponse)
        .catch(onResponseError)
    );
  } catch (reason) {
    return onRequestError(reason);
  }
};

export default createRequest;
