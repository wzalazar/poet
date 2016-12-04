import { assert } from './common'

import { BlockInfo, validateBlockInfoList } from './events/blockInfo'
import { Pop, Push, POP, PUSH, PopOrPush, ReorgAction } from './events/reorgActions'


export function reorgOps(lastBlockInfo: BlockInfo[], newBlockInfo: BlockInfo[]): ReorgAction[] {
    assert(validateBlockInfoList(lastBlockInfo), 'Invalid first argument')
    assert(validateBlockInfoList(newBlockInfo), 'Invalid second argument')

    let first = 0, second = 0

    function idMatch(): boolean {
        return lastBlockInfo[first].id === newBlockInfo[second].id
    }

    function betweenBoundary(): boolean {
        return first < lastBlockInfo.length && second < newBlockInfo.length
    }

    function advanceUntilIDMatches() {
        while (betweenBoundary() && !idMatch()) {
            if (lastBlockInfo[first].height < newBlockInfo[second].height) {
                first++
            } else {
                second++
            }
        }
    }

    function advanceWhileIDMatches() {
        while (betweenBoundary() && idMatch()) {
            first++;
            second++
        }
    }

    function op(operation: PopOrPush): (BlockInfo) => ReorgAction {
        return (value: BlockInfo) => ({
            id: value.id, type: operation, height: value.height
        })
    }

    advanceUntilIDMatches()
    if (!betweenBoundary()) {
        throw new Error('No common ancestor found between blockchains')
    }
    advanceWhileIDMatches()

    return lastBlockInfo.slice(first).reverse().map(op(POP))
        .concat(newBlockInfo.slice(second).map(op(PUSH)))
}

function combineOps<T>(pushOp: (PushOp) => T, popOp: (PopOp) => T) {
    return (op: ReorgAction) => op.type === POP ? popOp(op) : pushOp(op)
}

export function reorgMap<T>(prevState: BlockInfo[], newState: BlockInfo[],
                     pushFunc: (PushOp) => T, popFunc: (PopOp) => T) {
    return reorgOps(prevState, newState).map(combineOps(pushFunc, popFunc))
}

export default {
    reorgMap,
    reorgOps
}