FROM poet-base

COPY ["./node/config/trusted-publisher.json", "/etc/poet/trusted-publisher.json"]

#only for test
COPY ./node/tsconfig.json /poet
COPY ./node/package.json /poet
RUN npm install

VOLUME /poet/src

EXPOSE 6000
EXPOSE 5858

CMD [ "npm", "run", "trusted-publisher", "--", "-c", "/etc/poet/trusted-publisher.json" ]
