import { Configuration } from '../configuration';

export async function submitTx(tx: string) {
  return await fetch(
    Configuration.api.insight + '/tx/send',
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
  return await fetch(`${Configuration.api.insight}/addr/${address}/utxo`)
    .then((res: any) => res.json())
}

