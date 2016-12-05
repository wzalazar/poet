import * as Promise from 'bluebird'
import * as socketIO from 'socket.io-client'
import * as fetch from 'isomorphic-fetch'

const bitcore = require('bitcore-lib')

const parseJson = res => res.json()
const getTransaction = body => body.rawtx
const turnToBitore = bitcore.Transaction
const filterData = t => t.outputs.filter(o => o.script.isDataOut())
const pickData = outputs => outputs.length
    ? outputs[0].script.getData().toString()
    : null

export interface HashListener {
    (hash: string): any
}

export default class PoetInsightListener {
    insightUrl: string
    address: string
    socket: SocketIOClient.Socket
    listeners: HashListener[]

    constructor(insightUrl, address) {
        this.insightUrl = insightUrl
        this.address = address
        this.listeners = []

        this.socket = socketIO('wss://' + this.insightUrl)

        this.initSocket()
    }

    initSocket() {
        this.socket.on('connect', () => {
            console.log('connected')
            this.socket.emit('subscribe', 'inv')
            this.socket.on('tx', (tx) => {
                if (this.containsPoet(tx)) {
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

    containsPoet(tx) {
        return tx.vout.reduce(
            (prev, next) => prev || !!next[this.address], false
        )
    }

    fetchHash(tx) {
        const url = `https://${this.insightUrl}/api/rawtx/${tx}`

        return fetch(url)
            .then(parseJson)
            .then(getTransaction)
            .then(turnToBitore)
            .then(filterData)
            .then(pickData)
    }

    suscribe(listener) {
        this.listeners.push(listener)
    }
}
