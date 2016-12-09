import * as protobuf from 'protobufjs'
import * as path from 'path'

interface builders {
  claimBuilder       : protobuf.Type
  claimSerialization : protobuf.Type
  attribute          : protobuf.Type
  poetBlock          : protobuf.Type
}

const promise: Promise<builders> = (protobuf.load(path.join(__dirname, '../model/claim.proto')) as Promise<protobuf.Root>)
  .then((builder: protobuf.Root) => {
    return {
      claimBuilder       : builder.lookup('Poet.Claim') as protobuf.Type,
      claimSerialization : builder.lookup('Poet.ClaimSerializationForSigning') as protobuf.Type,
      attribute          : builder.lookup('Poet.Attribute') as protobuf.Type,
      poetBlock          : builder.lookup('Poet.PoetBlock') as protobuf.Type,
    }
  })
  .catch(e => {
    console.log(e, e.stack)
  })

export default promise