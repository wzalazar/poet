import * as protobuf from 'protobufjs'
import * as path from 'path'

export interface Builders {
  claimBuilder : protobuf.Type
  attribute    : protobuf.Type
  poetBlock    : protobuf.Type
}

export default async function(): Promise<Builders> {
  const builder = await (protobuf.load(path.join(__dirname, '../model/claim.proto')) as Promise<protobuf.Root>)
  return {
    claimBuilder : builder.lookup('Poet.Claim') as protobuf.Type,
    attribute    : builder.lookup('Poet.Attribute') as protobuf.Type,
    poetBlock    : builder.lookup('Poet.PoetBlock') as protobuf.Type,
  }
}

