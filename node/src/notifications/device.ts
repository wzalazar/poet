import {Table, Column, PrimaryColumn} from 'typeorm'

@Table()
export default class Device {

    @PrimaryColumn()
    registrationId: string

    @Column()
    deviceId: string

    @Column()
    deviceName: string

    @Column()
    platform: string

    @Column()
    publicKey: string
}