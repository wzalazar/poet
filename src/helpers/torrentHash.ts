const createTorrent = require('create-torrent')
const parseTorrent = require('parse-torrent')

export function getHash(data: Buffer, hash: string): Promise<string> {
  const file = new Buffer(data) as any
  file.name = hash

  const opts = {
    name: hash,
    comment: 'Poet Block #' + hash,
    createdBy: 'Poet'
  }
  return new Promise<string>((resolve, reject) => {
    createTorrent(file, opts, (error: any, file: Buffer) => {
      if (error) {
        return reject(error)
      }
      const torrent = parseTorrent(file)
      return resolve(torrent.infoHash)
    })
  })
}