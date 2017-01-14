import { Connection, createConnection } from 'typeorm'
import { Block } from "../../model/claim";

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
      __dirname + "/orm/*.ts"
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

  storeBlock(block: Block) {
  }
}
