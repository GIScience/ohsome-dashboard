import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    // setupFiles: should be specified in angular.json test section
  },
})
