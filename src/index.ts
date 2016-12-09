import { default as Service } from './systems/service'

import { default as PoetInsightListener } from './systems/insight'

import { default as DownloadSystem } from './systems/download'

import { ClaimCreator } from './systems/creator'

import {reorgOps} from './logic/reorg'

const creator = new ClaimCreator()

const bitcore = require('bitcore-lib')
const { io, socket, app } = Service

const addr = 'mg6CMr7TkeERALqxwPdqq6ksM2czQzKh5C'
const insight = 'test-insight.bitpay.com'

const downloadSystem = new DownloadSystem()

const system = new PoetInsightListener(insight, addr)
system.subscribe(hash => {
    socket.emit('poet discovered', hash)
    console.log('New hash discovered', hash)
})

let latestState = null
system.subscribeBlock(blockState => {
    if (latestState) {
        let diff = reorgOps(latestState, blockState)
        socket.emit('reorg', diff)
    }
    latestState = blockState
    socket.emit('blockstate', blockState)
    console.log('Current block state', blockState)
})

system.subscribeLegacyBlock(block => {
    socket.emit('blockfound', block)
    console.log('Found info for block', block)
})

system.subscribe(hash => {
    downloadSystem.downloadBlock(hash)
})

downloadSystem.subscribe((hash, block) => {
    socket.emit('downloaded', { hash, block })
})

io.on('message', (ctx, data) => {
    if (data.action === 'create claim') {
        const claim = creator.createSignedClaim(data, data.privateKey)
        const block = creator.createBlock([claim])
        downloadSystem.postBlock(block)
        creator.createTransaction(block.id).then(creator.broadcastTx)
    }
})

Service.app.listen(3000)