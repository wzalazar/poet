FROM poet-base

COPY ["./node/config/trusted-publisher.json", "/etc/poet/trusted-publisher.json"]

VOLUME /poet/src

EXPOSE 6000

CMD [ "npm", "run", "trusted-publisher", "--", "-c", "/etc/poet/trusted-publisher.json" ]