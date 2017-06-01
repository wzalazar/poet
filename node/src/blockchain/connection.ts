import * as path from 'path'
import { createConnection } from 'typeorm'
import { delay } from 'poet-js'

export async function getConnection(purpose: string) {
  let attempts = 30
  let lastError
  while (attempts--) {
    try {
      return await createConnection({
        driver: {
          type: 'postgres',
          host: 'db',
          port: 5432,
          username: 'poet',
          password: 'poet',
          database: 'poet'
        },
        entities: [
          path.join(__dirname, 'orm', '*.ts'),
          path.join(__dirname, 'orm', 'domain', '*.ts'),
          path.join(__dirname, 'orm', 'bitcoin', '*.ts'),
          path.join(__dirname, 'orm', 'events', '*.ts')
        ],
        autoSchemaSync: purpose === 'claimsToDb' // TODO: Remove this
      })
    } catch (error) {
      lastError = error
      await delay(3000)
    }
  }
  console.log('Never connected!', lastError, lastError.stack)
  throw new Error('Unable to connect to db')
}

