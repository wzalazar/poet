import { ClaimTypes } from 'poet-js'

export interface Claim {
    id: string

    publicKey: string
    signature: string

    type: ClaimTypes.ClaimType
    attributes: { [key: string]: string }
}

export interface Block {
    readonly id: string
    readonly claims: Claim[]
}