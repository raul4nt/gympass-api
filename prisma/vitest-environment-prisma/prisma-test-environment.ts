import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { execSync } from 'node:child_process'

import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'

const prisma = new PrismaClient()

// postgresql://docker:docker@localhost:5432/apisolid?schema=public

function generateDatabaseURL(schema: string) {
  // função que gera um novo DATABASE_URL do .env pra cada teste que executarmos
  // para termos um ambiente de teste isolado de banco de dados pra cada teste end to end
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
    // da um erro caso nao ache o DATABASE_URL no nosso .env
  }

  const url = new URL(process.env.DATABASE_URL)
  // esse URL é nativo do javascript. conseguimos usar ele pra manipular nosso DATABASE_URL porque
  // como o nome ja diz, ele é um url. a diferença é o protocolo, que ao inves de ser http é postgresql://
  // aqui estamos pegando o url que esta la no .env

  url.searchParams.set('schema', schema)
  // aqui estamos manipulando o seus searchParams(ou queryParams)
  // // postgresql://docker:docker@localhost:5432/apisolid?schema=public
  // como podemos ver, o schema é um searchParam. estamos setando o que vem depois do =
  // para o schema que vamos passar como parametro da funçao quando usarmos ela

  return url.toString()
  // retorna a url em string
}

// postgresql://docker:docker@localhost:5432/apisolid?schema=public

export default <Environment>{
  // usamos esse <Environment> pra pegar a tipagem de um enviornment
  // do vitest, pois estamos usando typescript
  name: 'prisma',
  // define o nome do environment
  async setup() {
    // essa funçao setup é a obrigatoria, e tem o que vai ser executado
    // antes de cada teste

    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)
    // passa um UUID novo pra ser o novo nome de schema do nosso DATABASE_URL(pra evitar repetiçao do nome)

    process.env.DATABASE_URL = databaseURL
    // seta o nosso DATABASE_URL do .env pro novo DATABASE_URL

    execSync('npx prisma migrate deploy')
    // o execSync serve pra executarmos comandos do console/terminal. estamos fazendo as migrations,
    // porem usando o deploy no final, entao ele nao verifica nada no nosso banco que esta rodando, ele apenas
    // executa todas as migrations que estao na pasta migrations, sem fazer comparaçao nenhuma

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          // o executeRawUnsafe serve pra usarmos comandos mais comprometedores, como o delete
          `DROP SCHEMA IF EXISTS "${schema}}" CASCADE`,
          // no fim de cada teste, apagamos o schema usado pra ele, pois nao precisaremos dele futuramtne, uma vez que
          // sempre criaremos um novo
        )

        await prisma.$disconnect()
        // desconecta do banco pra nao deixar conexoes em aberto

        // o teardown contem a execuçao que vai vir depois de cada teste
      },
    }
  },
}
