import * as path from 'path'
import { createConnection } from 'typeorm'
import { delay } from '../common'

export default async function getConnection() {
  let attempts = 20
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
          path.join(__dirname, 'orm', 'derived', '*.ts')
        ],
        autoSchemaSync: true
      })
    } catch (error) {
      await delay(1000)
    }
  }
}

