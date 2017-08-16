FROM poet-base

COPY ["./node/config/notifications.json", "/etc/poet/notifications.json"]

VOLUME /poet/src

EXPOSE 5500

CMD [ "npm", "run", "notifications", "--", "-c", "/etc/poet/notifications.json" ]
