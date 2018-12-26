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
    onError = (reason?: Error) => Promise.reject(reason),
    onRequest = (options: RequestOptions) => options,
    onRequestError = onError,
    onResponse = (response: Response): Promise<Response> => Promise.resolve(response),
    onResponseError = onError
  }: RequestInterceptors & {
    onRequest?: (...params: [RequestOptions]) => RequestOptions,
    onResponse?: (response: Response) => Response | PromiseLike<Response>,
  } = {}
) => function (): Promise<Response> {
  const params = arguments as unknown as [RequestOptions];
  try {
    const options = onRequest.apply(null, params) as RequestOptions;
    return (
      fetch(options.url, options)
        .then(onResponse)
        .catch(onResponseError)
    );
  } catch (reason) {
    return onRequestError(reason);
  }
};

export default createRequest;
