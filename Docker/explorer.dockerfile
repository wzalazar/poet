FROM poet-base

VOLUME /poet/src

EXPOSE 3000
CMD [ "npm", "run", "explorer-api" ]
