FROM poet-base
VOLUME /poet/src
CMD [ "npm", "run", "bitcoin-scanner" ]
