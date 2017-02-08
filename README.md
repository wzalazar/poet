# poet

[Current Target: Milestone #1 (Feb 10th)](https://github.com/poetapp/poet/milestone/1)

## About

poet is a subjective trust engine used for copyright management.

## Running a node

1. Install `docker` (instructions vary according to your operating system).
2. Install the latest version of `docker-compose` using `pip install docker-compose`.
3. Set up the system (you may need root access). You can target `development` or `staging` (`production` to come soon):
```
make development
```
or
```
make staging
```

4. Run the node
```
make start
```

5. Access `localhost:10000` for development or `https://localhost' for staging

## Hacking

Everything is coded in `typescript`, but some types are missing.

### Node

The system sets up a couple of microservices that make the system behave correctly.

1. `claims-to-db`: Processes all claims and stores them in the blockchain.
  * TODO: Split "trusted" and "untrusted" claims
2. `explorer-api`: Runs the REST API to query the trusted view of the Poet blockchain
3. `auth-server`: Runs an authentication server
1. `bitcoin-scanner`: Hooks to the bitcoin blockchain and notifies of new transactions and blocks.
  * TODO: We need to stop using Insight and run a Bitcoin node.
2. `torrent-system`: Receive orders to download new blocks and notifies when torrents are finished downloading.
3. `mock-signer`: Development only, simulates a QR code scan by the app whenever a click in a QR is made.
3. `trusted-publisher`: System that queues and generates new Poet blocks, and bitcoin transactions.
  * TODO: Actually queue

### Web interface

TODO

* Redux
* Sagas
* ResourceProvider
* Login and singing model

## Notaries

TODO

## License
