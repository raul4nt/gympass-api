import { Environment } from 'vitest'

export default <Environment>{
  // usamos esse <Environment> pra pegar a tipagem de um enviornment
  // do vitest, pois estamos usando typescript
  name: 'prisma',
  // define o nome do environment
  async setup() {
    console.log('Executou')
    // essa funçao setup é a obrigatoria, e tem o que vai ser executado
    // antes de cada teste

    return {
      async teardown() {
        console.log('Teardown')
        // o teardown contem a execuçao que vai vir depois de cada teste
      },
    }
  },
}
