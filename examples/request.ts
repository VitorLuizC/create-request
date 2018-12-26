import createRequest from '../';

const request = createRequest(window.fetch, {
  onResponse: (response) => response.text(),
  onRequest: ({ url }: { url: string; }) => {
    return {
      url
    };
  }
});

request({
  url: '',
}).then()
