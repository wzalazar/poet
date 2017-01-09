import * as socketIO from 'socket.io-client'
import * as fetch from 'isomorphic-fetch'

import { BitcoinBlockInfo, PoetTxInfo } from '../events/bitcoin/blockInfo'

const bitcore = require('bitcore-lib')

const parseJson = res => res.json()
const pluckMember = name => obj => obj[name]
const getTransaction = pluckMember('rawtx')
const getBuffer = data => new Buffer(data, 'hex')
const turnToBitcoreTx = bitcore.Transaction
const turnToBitcoreBlock = bitcore.Block

export interface HashListener {
  (hash: string): any
}

export interface PoetInfoListener {
  (block: BitcoinBlockInfo): any
}

export default class PoetInsightListener {
  insightUrl: string
  socket: SocketIOClient.Socket
  txListeners: HashListener[]
  bitcoinBlockListeners: PoetInfoListener[]

  constructor(insightUrl) {
    this.insightUrl = insightUrl
    this.txListeners = []
    this.bitcoinBlockListeners = []

    this.socket = socketIO('wss://' + this.insightUrl)

    this.initSocket()
  }

  initSocket() {
    this.socket.on('connect', () => {
      this.socket.emit('subscribe', 'inv')
      this.socket.on('block', this.manageNewBlock.bind(this))
      this.socket.on('tx', this.manageNewTx.bind(this))
    })
  }

  async manageNewTx(tx) {
    const poetData = await this.containsPoetForSocket(tx);
    if (poetData) {
      this.txListeners.forEach(txListener => {
        txListener(poetData)
      })
    }
  }

  async manageNewBlock(block) {
    const bitcoreBlock = await fetch(`https://${this.insightUrl}/api/rawblock/${block.hash}`)
      .then(parseJson)
      .then(pluckMember('rawblock'))
      .then(getBuffer)
      .then(turnToBitcoreBlock)
    this.scanBitcoreBlock(bitcoreBlock, block.height)
  }

  notifyPoetData(newState) {
    this.bitcoinBlockListeners.forEach(listener => listener(newState))
  }

  scanBitcoreBlock(block, height) {
    const txs = block.transactions.map((tx, index): PoetTxInfo | null => {
      const poetData = this.containsPoetForBitcore(tx)
      if (!poetData) {
        return
      }
      return Object.assign({}, poetData, {
        blockHeight      : height,
        blockHash        : block.hash,
        transactionOrder : index
      })
    }).filter(tx => !!tx)
    const blockInfo: BitcoinBlockInfo = {
      blockHeight : height,
      blockHash   : block.hash,
      poet        : txs
    }
    this.notifyPoetData(blockInfo)
  }

  containsPoetForBitcore(tx) {
    const check = function(script, index) {
      if (script.classify() !== bitcore.Script.types.DATA_OUT)
        return
      const data = script.getData()
      return data[0] === 'B'
          && data[1] === 'A'
          && data[2] === 'R'
          && data[3] === 'D'
          && {
            txHash       : tx.hash,
            outputNumber : index,
            poetHash     : data.slice(4)
          }
    }
    return tx.outputs.reduce(
      (prev, next, index) => prev || check(next.script, index), false
    )
  }

  containsPoetForSocket(tx) {
    return this.fetchTxByHash(tx.hash)
      .then(this.containsPoetForBitcore)
  }

  fetchTxByHash(txhash) {
    const url = `https://${this.insightUrl}/api/rawtx/${txhash}`

    return fetch(url)
      .then(parseJson)
      .then(getTransaction)
      .then(turnToBitcoreTx)
  }

  subscribeTx(listener: HashListener) {
    this.txListeners.push(listener)
  }

  subscribeBlock(listener: PoetInfoListener) {
    this.bitcoinBlockListeners.push(listener)
  }
}
