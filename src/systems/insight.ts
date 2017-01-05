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
      this.socket.emit('subscribe', 'inv')
      this.socket.on('block', (block) => {
        this.manageNewBlock()
      })
      this.socket.on('tx', async (tx) => {
        const poetData = await this.containsPoetForSocket(tx)
        if (poetData) {
          this.listeners.forEach(listener => {
            listener(poetData)
          })
        }
      })
    })
  }

  manageNewBlock() {
    return fetch(`https://${this.insightUrl}/api/blocks?limit=100`)
      .then(parseJson)
      .then(getBlocks)
      .then(blocks => {
        const newState = blocks.map(block => ({
          id: block['id'],
          height: block.height
        })).reverse()
        this.blockListeners.forEach(listener => listener(newState))
      })
  }

  scanBitcoreBlock(block, height) {
    const txs = block.transactions.map((tx, index): PoetTxInfo | null => {
      const poetData = this.containsPoetForBitcore(tx)
      if (!poetData) {
        return
      }
      return Object.assign({}, poetData, {
        blockHeight: height,
        blockHash: block.hash,
        transactionOrder: index
      })
    }).filter(tx => !!tx)
    const blockInfo: PoetInfo = {
      height: height,
      id: block.hash,
      poet: txs
    }
    this.blockPoetListeners.forEach(listener => listener(blockInfo))
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
      .then(turnToBitore)
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
