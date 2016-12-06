export type Pop = 'POP'
export type Push = 'PUSH'
export type PopOrPush = Pop | Push

export interface ReorgAction {
    id: string
    type: PopOrPush
    height: number
}

export interface PopOp extends ReorgAction {
    type: Pop
}

export interface PushOp extends ReorgAction {
    type: Push
}

export const PUSH: Push = 'PUSH'

export const POP: Pop = 'POP'