import { defineAction } from 'astro:actions';

export const server = {
  getDuckUrl: defineAction({
    handler: async () => {
      const url = 'https://random-d.uk/api/v2/random';
      const response = await fetch(url);
      const result = await response.json();
      const imageUrl = result.url;
      return imageUrl;
    }
  })
}