import * as fs from 'fs'

export interface Configuration {
  readonly notaryPrivateKey: string
  readonly bitcoinAddressPrivateKey: string
  readonly bitcoinAddress: string
}

export function getConfiguration(configurationFilePath: string): Configuration {
  if (!fs.existsSync(configurationFilePath)) {
    console.error(`File "${configurationFilePath}" not found.`)
    process.exit()
  }

  return JSON.parse(fs.readFileSync(configurationFilePath, 'utf8'))
}