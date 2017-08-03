FROM poet-typescript

RUN mkdir -p /poet
WORKDIR /poet

COPY ./Docker/gitconfig /root/.gitconfig
COPY ./node/package.json /poet
COPY ./node/tsconfig.json /poet
RUN npm install

WORKDIR /poet
