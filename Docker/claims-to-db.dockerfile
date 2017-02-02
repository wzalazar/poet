FROM poet-base

VOLUME /poet/src

CMD [ "npm", "run", "claims-to-db" ]
