FROM library/nginx

COPY ./Docker/nginx/staging.conf /etc/nginx/nginx.conf

VOLUME /static

VOLUME /etc/letsencrypt
