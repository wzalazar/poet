FROM poet-base

VOLUME /poet/src

EXPOSE 5500

CMD [ "npm", "run", "notifications" ]
