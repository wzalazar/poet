FROM library/nginx

COPY ./Docker/nginx/development.conf /etc/nginx/nginx.conf

VOLUME /static

EXPOSE 10000

VOLUME /etc/letsencrypt
