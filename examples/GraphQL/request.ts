import createRequest from '../../';

type GraphQLResponse = {
  data?: null | { [graph: string]: any };
  errors?: {
    message?: string;
  }[];
};

const resolveMessage = (error: any) => {
  return (error && error.message) || 'Unknown error.';
};

export default createRequest(window.fetch, {
  onRequest: (query: string, variables: { [name: string]: any } = {}) => ({
    url: 'https://api.github.com/graphql',
    body: JSON.stringify({ query, variables }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  onResponse: async (response) => {
    try {
      const { data, errors = [] } = (await response.json()) as GraphQLResponse;
      if (data === null && errors.length > 0)
        throw new Error(resolveMessage(errors[0]));
      return data;
    } catch (error) {
      throw error;
    }
  },
  onError: (error) => {
    const message = resolveMessage(error);
    console.dir({
      ms: Date.now(),
      message,
    });
    return Promise.reject(message);
  },
});
