import * as fetch from 'isomorphic-fetch'

import PoetInsightListener from './insight'
import {reorgOps} from '../logic/reorg'

const bitcore = require('bitcore-lib')

const addr = 'mg6CMr7TkeERALqxwPdqq6ksM2czQzKh5C'
const insight = 'test-insight.bitpay.com'

const system = new PoetInsightListener(insight, addr)
system.subscribe(hash => {
    console.log('New hash discovered', hash)
})

let latestState = null
system.subscribeBlock(blockState => {
    if (latestState) {
        let diff = reorgOps(latestState, blockState)
        console.log('Reorg: ', diff)
    }
    latestState = blockState
    console.log('Current block state', blockState)
})


system.subscribeLegacyBlock(block => {
    console.log('Found info for block', block)
})

fetch('https://test-insight.bitpay.com/api/rawblock/0000000000011022f062b72cae5441a634be01da1ae47ec7e40d26735661fa34')
    .then(r => r.json())
    .then(b => new bitcore.Block(new Buffer(b.rawblock, 'hex')))
    .then(block => system.scanBitcoreBlock(block, 1054206))
    .catch(e => console.log(e))

// Priv: 343689da46542f2af204a3ced0ce942af1c25476932aa3a48af5e683df93126b
// Pub: 03155e888e65e9304d8139cc34007c86db3adde6d7297cd31f7f7f6fdd42dfb4dc
// Addr: mg6CMr7TkeERALqxwPdqq6ksM2czQzKh5C