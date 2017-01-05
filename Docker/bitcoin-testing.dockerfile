FROM ubuntu
MAINTAINER Esteban Ordano

RUN apt-get update && apt-get install -y software-properties-common

RUN add-apt-repository ppa:bitcoin/bitcoin \
 && apt-get update \
 && apt-get install -y --no-install-recommends bitcoind \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

VOLUME ["/.bitcoin"]

# bitcoind testnet ports
EXPOSE 18332 18333

CMD ["/usr/bin/bitcoind" "-datadir" "/.bitcoin"]
