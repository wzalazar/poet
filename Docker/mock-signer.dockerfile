FROM poet-base

VOLUME /poet/src

EXPOSE 5000

CMD [ "npm", "run", "mock-signer" ]
