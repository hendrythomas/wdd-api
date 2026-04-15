import { defineAction } from 'astro:actions';

export const server = {
  getDuckUrl: defineAction({
    handler: async () => {
      const url = 'https://random-d.uk/api/v2/random?type=jpg';
      const response = await fetch(url);
      const result = await response.json();
      const imageUrl = result.url;
      return imageUrl;
    }
  }),
  getCatUrl: defineAction({
    handler: async () => {
      const url = 'https://cataas.com/cat?json=true';
      const response = await fetch(url);
      const result = await response.json();
      const imageUrl = result.url;
      return imageUrl;
    }
  }),
  getDogUrl: defineAction({
    handler: async () => {
      const url = 'https://dog.ceo/api/breeds/image/random';
      const response = await fetch(url);
      const result = await response.json();
      const imageUrl = result.message;
      return imageUrl;
    }
  })
}