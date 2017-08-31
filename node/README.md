# Po.et Node

Poet is a subjective trust engine used for copyright management.

## Getting Started
To run a Po.et node in your local machine:
1. Install `docker` and `docker-compose`
2. Create configuration files for the different services
3. Build the system running `sudo make development` on Ubuntu or `make development` in OS X
4. Open a web browser to `localhost:3000` 

## Architecture

A Po.et Node is made up of several microservices that communicate with each other using RabbitMQ.

#### explorer-api

Runs the REST API to query the Poet blockchain. This API is mainly read-only, and allows you to retrieve works, licences, profiles, etc.

All this information is read from the Postrgres database, which is fed by claims-to-db.

[poet-js](https://github.com/poetapp/poet-js) has a client for this API with Typescript definitions.

Runs on `/api/explorer`. For example: `http://localhost:10000/api/explorer/works`.

> The url `/api/explorer` is currently configured in the frontend's webpack [devServer](https://github.com/poetapp/poet/blob/master/web/devServer.js#L22). It will be moved in the future.

#### trusted-publisher

Runs the REST API on which claims can be posted.

This system performs the following steps:

- Performing validations on the submitted claims
- Creates new claims on memory based on the submitted claims (for example, Title of Ownership claims for submitted Work claims)
- Bundles the submitted claims and created claims into a block
- Calculates the hash of this block and timestampts it to the blockchain
- Publishes a `SEND_BLOCK` message to RabbitMQ, serializing the entire block into the message. This message is consumed by torrent-system, which seeds this block, and claims-to-db, which stores the claims in the block to the postgres database that is read by explorer-api.

Runs on `/api/user`. See [poet-feed-consumer](https://github.com/poetapp/feed-consumer) and [poet-feeds](https://github.com/poetapp/feeds) for examples on how to submit claims.

> The url `/api/user` is currently configured in the frontend's webpack [devServer](https://github.com/poetapp/poet/blob/master/web/devServer.js#L30). It will be moved in the future.

#### claims-to-db

Processes all claims and stores them in the database.

> TODO: Split "trusted" and "untrusted" claims

#### auth-server

Runs an authentication server that communicates with poet-web and the mobile Authenticator apps.

#### bitcoin-scanner

Hooks to the bitcoin blockchain and notifies of new transactions and blocks.

#### torrent-system

Receive orders to download new claim blocks and notifies when torrents are finished downloading.

#### mock-signer

Development mode only. Used by the frontend to simulates a QR code scan by the app whenever a click on a QR is made.

Allows testing both poet-node and poet-web without having to scan QR codes with the Authenticator.
