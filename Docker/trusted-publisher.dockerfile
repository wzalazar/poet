FROM poet-base
VOLUME /poet/src
CMD [ "npm", "run", "torrent-system" ]
