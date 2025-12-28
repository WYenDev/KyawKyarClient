import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: process.env.OPENAPI_URL ?? 'http://localhost:3000/api/openapi.json',
    },
    output: {
      mode: 'single',
      target: 'src/services/api.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: 'src/services/mutator.ts',
          name: 'mutator',
        },
      },
    },
  },
});
