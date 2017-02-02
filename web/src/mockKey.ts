const bitcore = require('bitcore-lib');

export const MOCK_KEY = '_mockKey';

export function unsafeRandomKey() {
  return bitcore.crypto.Hash.sha256(new Buffer(''+Math.random())).toString('hex');
}

let retrieved: string;

export function getMockPrivateKey() {
  if (retrieved) {
    return retrieved;
  }
  retrieved = localStorage.getItem('_mockKey') || unsafeRandomKey();
  localStorage.setItem(MOCK_KEY, retrieved);
  return retrieved
}
