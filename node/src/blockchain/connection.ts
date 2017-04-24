import * as path from 'path'
import { createConnection } from 'typeorm'
import { delay } from '../common'

export default async function getConnection(purpose: string) {
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
        autoSchemaSync: true || purpose === 'claimsToDb' // TODO: hard code
      })
    } catch (error) {
      lastError = error
      await delay(3000)
    }
  }
  console.log('Never connected!', lastError, lastError.stack)
  throw new Error('Unable to connect to db')
}

