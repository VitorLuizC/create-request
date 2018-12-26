type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

type FetchOptions = RequestInit & { url: string; };

type FetchInterceptors = {
  onError?: (reason?: Error) => Promise<never>,
  onRequestError?: (reason?: Error) => Promise<never>,
  onResponseError?: (reason?: Error) => Promise<never>
};

type FetchFactory = {
  <R = Response> (
    fetch: FetchFunction, interceptors?: FetchInterceptors & {
      onResponse: (response: Response) => R | PromiseLike<R>
    }
  ): (...params: [FetchOptions]) => Promise<R>;
  <A extends any[]> (
    fetch: FetchFunction, interceptors?: FetchInterceptors & {
      onRequest: (...params: A) => FetchOptions
    }
  ): (...params: A) => Promise<Response>;
  <A extends any[], R = Response> (
    fetch: FetchFunction, interceptors?: FetchInterceptors & {
      onRequest: (...params: A) => FetchOptions,
      onResponse: (response: Response) => R | PromiseLike<R>
    }
  ): (...params: A) => Promise<R>;
};

const factory: FetchFactory = (
  fetch: FetchFunction, {
    onError = (reason) => Promise.reject(reason),
    onRequest = (...params: [FetchOptions, ...any[]]) => params[0],
    onRequestError = onError,
    onResponse = (response): Promise<Response> => Promise.resolve(response),
    onResponseError = onError
  } = {}
) => {
  return (...params: [FetchOptions, ...any[]]): Promise<Response> => {
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
}

export default factory;
