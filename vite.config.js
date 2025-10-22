import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: "src/xgamecovers.js",
      name: "XGameCovers",
      fileName: 'xgamecovers',
    },
  },
})
