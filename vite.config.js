import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  // ajuda o vitest a entender aquela alteraçao que fizemos
  // no ts config, de usar aliases(o @ aquele pra caminhos enormes)
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
  },
})
