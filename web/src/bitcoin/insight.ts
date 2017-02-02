import auth from '../auth'

export async function submitTx(tx: string) {
  return await fetch(
    'https://test-insight.bitpay.com/api/tx/send',
    {
      method: 'POST',
      body: JSON.stringify({ rawtx: tx }),
      headers:{
        'content-type': 'application/json'
      }
    }
  ).then((res: any) => res.json()).then((res: any) => res.txid)
}

export async function getUtxos(address: string) {
  return await fetch(`https://test-insight.bitpay.com/api/addr/${address}/utxo`)
    .then((res: any) => res.json())
}

