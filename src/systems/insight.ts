import * as Promise from 'bluebird'
import * as socketIO from 'socket.io-client'
import * as fetch from 'isomorphic-fetch'

import { BlockInfo } from '../events/bitcoin/blockInfo'
import { PoetInfo, PoetTxInfo } from '../events/bitcoin/blockInfo'

const bitcore = require('bitcore-lib')

const parseJson = res => res.json()
const pluck = name => obj => obj[name]
const getTransaction = pluck('rawtx')
const getBlocks = pluck('blocks')
const turnToBitore = bitcore.Transaction
const filterData = t => t.outputs.filter(o => o.script.isDataOut())
const pickData = outputs => outputs.length
  ? outputs[0].script.getData().toString()
  : null

export interface HashListener {
  (hash: string): any
}

export interface BlockStateListener {
  (blocks: BlockInfo[]): any
}

export interface PoetInfoListener {
  (block: PoetInfo): any
}

export default class PoetInsightListener {
  insightUrl: string
  address: string
  socket: SocketIOClient.Socket
  listeners: HashListener[]
  blockListeners: BlockStateListener[]
  blockPoetListeners: PoetInfoListener[]

  constructor(insightUrl, address) {
    this.insightUrl = insightUrl
    this.address = address
    this.listeners = []
    this.blockListeners = []
    this.blockPoetListeners = []

    this.socket = socketIO('wss://' + this.insightUrl)

    this.initSocket()
  }

  initSocket() {
    this.socket.on('connect', () => {
      console.log('connected')
      this.socket.emit('subscribe', 'inv')
      this.socket.on('block', (block) => {
        this.manageNewBlock()
      })
      this.socket.on('tx', (tx) => {
        if (this.containsPoetForSocket(tx)) {
          this.fetchHash(tx.txid).then((hash: string) => {
            if (hash) {
              this.listeners.forEach(listener => {
                listener(hash)
              })
            }
          })
        }
      })
    })
  }

  manageNewBlock() {
    fetch(`https://${this.insightUrl}/api/blocks?limit=6`)
      .then(parseJson)
      .then(getBlocks)
      .then(blocks => {
        const newState = blocks.map(block => ({
          id: block.hash,
          height: block.height
        })).reverse()
        this.blockListeners.forEach(listener => listener(newState))
      })
  }

  scanBitcoreBlock(block, height) {
    const txs = block.transactions.map((tx, index): PoetTxInfo | null => {
      if (this.containsPoetForBitcore(tx)) {
        return {
          hash: tx.hash,
          position: index,
          poetId: this.getPoetHashFromBitcoreTx(tx)
        }
      }
    }).filter(tx => !!tx)
    const blockInfo: PoetInfo = {
      height: height,
      id: block.hash,
      poet: txs
    }
    this.blockPoetListeners.forEach(listener => listener(blockInfo))
  }

  containsPoetForBitcore(tx) {
    const addressBuffer = new bitcore.Address(this.address).hashBuffer
    const check = function(script) {
      return script.classify() === bitcore.Script.types.PUBKEYHASH_OUT
          && addressBuffer.compare(script.getData()) === 0
    }
    return tx.outputs.reduce(
      (prev, next) => prev || check(next.script), false
    )
  }

  containsPoetForSocket(tx) {
    return tx.vout.reduce(
      (prev, next) => prev || !!next[this.address], false
    )
  }

  getPoetHashFromBitcoreTx(tx) {
    return pickData(filterData(tx))
  }

  fetchHash(tx) {
    const url = `https://${this.insightUrl}/api/rawtx/${tx}`

    return fetch(url)
      .then(parseJson)
      .then(getTransaction)
      .then(turnToBitore)
      .then(this.getPoetHashFromBitcoreTx)
  }

  subscribe(listener: HashListener) {
    this.listeners.push(listener)
  }

  subscribeBlock(listener: BlockStateListener) {
    this.blockListeners.push(listener)
  }

  subscribeLegacyBlock(listener: PoetInfoListener) {
    this.blockPoetListeners.push(listener)
  }
}
