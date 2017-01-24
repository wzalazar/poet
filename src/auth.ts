import * as SocketIO from 'socket.io-client'
import { v4 } from 'uuid'
import config from './config'

interface PromiseInfo<T> {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (error: any) => void
}

export class AuthSocket {
  private socket: any;
  private currentlyConnected: boolean;
  private promises: { [key:string]: PromiseInfo<string> };
  private handler: (data: string) => void;

  constructor(handler?: (payload: string) => void) {
    this.socket = SocketIO(config.api.auth);
    this.currentlyConnected = false;
    this.promises = {};
    this.handler = handler;
    this.socket.on('connected', this.connected.bind(this));
    this.socket.on('disconnect', this.disconnect.bind(this));
    this.socket.on('message', this.handleMessage.bind(this));
  }

  connected() {
    this.currentlyConnected = true;
    for (let message of Object.keys(this.promises)) {
      this.socket.emit('request', JSON.stringify({
        type: 'associate',
        id: message
      }))
    }
    return;
  }

  disconnect() {
    this.currentlyConnected = false;
    return;
  }

  handleMessage(payload: string) {
    const info = JSON.parse(payload);
    if (info.ref) {
      const promise = this.promises[info.ref];
      if (promise) {
        promise.resolve(JSON.parse(info.encoded));
        return
      }
    }
    if (info.id) {
      const promise = this.promises[info.ref || info.id];
      if (promise) {
        const message = JSON.parse(info.request).message
        promise.resolve({ ...info, message });
        return
      }
    }
    this.handler(payload)
  }

  getRequestIdFor(payload: Buffer) {
    const ref = v4();
    const data = JSON.stringify({
      type: 'create',
      payload: payload.toString('hex'),
      ref
    });
    const defer = AuthSocket.defer();
    this.promises[ref] = defer;
    this.socket.emit('request', data);
    return defer.promise
  }

  getRequestIdForLogin(): Promise<string> {
    return this.getRequestIdFor(new Buffer(JSON.stringify({
      timestamp: Date.now()
    })));
  }

  getRequestIdForMultipleSigning(payload: string[]): Promise<string> {
    const ref = v4();
    const data = JSON.stringify({
      type: 'multiple',
      payload: payload.map(payload => new Buffer(payload).toString('hex')),
      ref
    });
    const defer = AuthSocket.defer();
    this.promises[ref] = defer;
    this.socket.emit('request', data);
    return defer.promise
  }

  onResponse(id: string): Promise<string> {
    const defer = AuthSocket.defer();
    this.promises[id] = defer;
    return defer.promise
  }

  static defer() {
    var resolve, reject;
    var promise = new Promise(function() {
      resolve = arguments[0];
      reject = arguments[1];
    });
    return { resolve, reject, promise }
  }

  setHandler(handler: (data:string) => void) {
    this.handler = handler
  }
}

export default new AuthSocket();
