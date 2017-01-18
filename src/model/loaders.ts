import * as protobuf from 'protobufjs'
import * as path from 'path'

export interface Builders {
  claim     : protobuf.Type
  attribute : protobuf.Type
  block     : protobuf.Type
}

export default async function(): Promise<Builders> {
  const builder = await (protobuf.load(path.join(__dirname, '../model/claim.proto')) as Promise<protobuf.Root>)
  return {
    claim     : builder.lookup('Poet.Claim') as protobuf.Type,
    attribute : builder.lookup('Poet.Attribute') as protobuf.Type,
    block     : builder.lookup('Poet.Block') as protobuf.Type,
  }
}

