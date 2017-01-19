import * as path from 'path'
import { createConnection } from 'typeorm'

export default async function getConnection() {
  return createConnection({
    driver: {
      type: 'postgres',
      host: 'localhost',
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
}

