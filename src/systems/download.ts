export default class DownloadSystem {
  listeners

  constructor() {
    this.listeners = []
  }

  downloadBlock(hash: string) {
  }

  subscribe(listener) {
    this.listeners.push(listener)
  }
}