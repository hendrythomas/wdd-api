import { defineAction } from 'astro:actions';

export const server = {
  apiTest: defineAction({
    handler: async () => {
      console.log('api test');
    }
  })
}