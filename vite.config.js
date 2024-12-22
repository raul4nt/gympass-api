import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  // ajuda o vitest a entender aquela alteraçao que fizemos
  // no ts config, de usar aliases(o @ aquele pra caminhos enormes)
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
    // configurando o test environment. colocamos onde estao estes destes
    // (estao nos controllers), e aquele prisma ali é tudo o que vem depois
    // de test-environment-(alguma coisa). a nossa pasta é test-environment-prisma,
    // entao ali coloquei prisma, q é oq vem depois
  },
})
