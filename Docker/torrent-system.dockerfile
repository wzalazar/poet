FROM poet-base
VOLUME /poet/src
VOLUME /poet/torrents
CMD [ "npm", "run", "torrent-system" ]
