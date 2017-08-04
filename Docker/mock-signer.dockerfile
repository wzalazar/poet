FROM poet-base

VOLUME /poet/src

EXPOSE 7000

CMD [ "npm", "run", "mock-signer" ]
