FROM poet-base

VOLUME /poet/src

EXPOSE 6000

CMD [ "npm", "run", "trusted-publisher" ]
