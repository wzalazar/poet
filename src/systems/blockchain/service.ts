import { Connection, createConnection } from 'typeorm'
import { PoetBlock } from "../../model/claim";

export async function getConnection() {
  return createConnection({
    driver: {
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "poet",
      password: "poet",
      database: "poet"
    },
    entities: [
      __dirname + "/models/*.ts"
    ],
    autoSchemaSync: true
  })
}

export default class BlockchainService {
  db: Connection

  constructor() {
  }

  async start() {
    this.db = await getConnection()
    return null
  }

  storeBlock(block: PoetBlock) {
  }
}
