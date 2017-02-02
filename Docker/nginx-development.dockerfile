FROM library/nginx

COPY ./Docker/nginx/development.conf /etc/nginx/nginx.conf

VOLUME /static

VOLUME /etc/letsencrypt
