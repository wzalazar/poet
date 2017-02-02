import * as socketIO from 'socket.io-client'
import * as fetch from 'isomorphic-fetch'

import { BitcoinBlockMetadata, BlockMetadata } from './events'

const bitcore = require('bitcore-lib')

const notNull = (x: any) => !!x
const parseJson = (x: any) => x.json()
const pluckMember = (name: string) => (obj: any) => obj[name]
const getTransaction = pluckMember('rawtx')
const getBuffer = (data: string) => new Buffer(data, 'hex')
const turnToBitcoreTx = bitcore.Transaction
const turnToBitcoreBlock = bitcore.Block

export interface TxInfoListener {
  (txInfo: BlockMetadata): any
}

export interface BlockInfoListener {
  (block: BitcoinBlockMetadata): any
}

export default class PoetInsightListener {

  static BARD = new Buffer('BARD')
  static VERSION = new Buffer([0, 0, 0, 1])

  insightUrl: string
  socket: SocketIOClient.Socket
  txListeners: TxInfoListener[]
  bitcoinBlockListeners: BlockInfoListener[]

  constructor(insightUrl: string) {
    this.insightUrl = insightUrl
    this.txListeners = []
    this.bitcoinBlockListeners = []

    this.socket = socketIO(this.insightUrl)

    this.initSocket()
  }

  initSocket() {
    this.socket.on('error', (error: any) => {
      console.log(error)
    })
    this.socket.on('connect', () => {
      this.socket.emit('subscribe', 'inv')
    })
    this.socket.on('block', this.manageNewBlock.bind(this))
    this.socket.on('tx', this.manageNewTx.bind(this))
  }

  async manageNewTx(tx: any) {
    try {
      const poetData = await this.containsPoetForSocket(tx);
      if (poetData) {
        this.txListeners.forEach(txListener => {
          txListener(poetData)
        })
      }
    } catch (error) {
      console.log('Managing tx failed', error, error.stack)
    }
  }

  async manageNewBlock(block: any) {
    try {
      const height = await fetch(`${this.insightUrl}/api/block/${block}`)
        .then(parseJson)
        .then(pluckMember('height'))
      const bitcoreBlock = await fetch(`${this.insightUrl}/api/rawblock/${block}`)
        .then(parseJson)
        .then(pluckMember('rawblock'))
        .then(getBuffer)
        .then(turnToBitcoreBlock)
      return this.scanBitcoreBlock(bitcoreBlock, height)
    } catch (error) {
      console.log('Error handling block', error, error.stack)
    }
  }

  notifyPoetData(newState: BitcoinBlockMetadata) {
    this.bitcoinBlockListeners.forEach(listener => listener(newState))
  }

  scanBitcoreBlock(block: any, height: number) {
    const txs = block.transactions.map((tx: any, index: number): BlockMetadata | null => {
      const poetData = this.containsPoetForBitcore(tx)
      if (!poetData) {
        return
      }
      return Object.assign({}, poetData, {
        blockHeight      : height,
        blockHash        : block.hash,
        transactionOrder : index
      })
    }).filter(notNull)
    const blockInfo: BitcoinBlockMetadata = {
      blockHeight : height,
      blockHash   : block.hash,
      timestamp   : block.header.time,
      poet        : txs
    }
    this.notifyPoetData(blockInfo)
    return blockInfo
  }

  containsPoetForBitcore(tx: any): BlockMetadata {
    const check = function(script: any, index: number) {
      if (script.classify() !== bitcore.Script.types.DATA_OUT)
        return
      const data: Buffer = script.getData()
      return data.indexOf(PoetInsightListener.BARD) === 0
          && data.indexOf(PoetInsightListener.VERSION) === 4
          ? {
            transactionHash : tx.hash,
            outputIndex     : index,
            torrentHash     : data.slice(8).toString('hex')
          }
          : null
    }
    return tx.outputs.reduce(
      (prev: boolean, next: any, index: number) => prev || check(next.script, index), false
    )
  }

  containsPoetForSocket(tx: any) {
    return this.fetchTxByHash(tx.txid).then(this.containsPoetForBitcore)
  }

  fetchTxByHash(txHash: string) {
    const url = `${this.insightUrl}/api/rawtx/${txHash}`

    return fetch(url)
      .then(parseJson)
      .then(getTransaction)
      .then(turnToBitcoreTx)
  }

  subscribeTx(listener: TxInfoListener) {
    this.txListeners.push(listener)
  }

  subscribeBlock(listener: BlockInfoListener) {
    this.bitcoinBlockListeners.push(listener)
  }
}
