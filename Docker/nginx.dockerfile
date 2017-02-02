FROM library/nginx
COPY ./Docker/nginx/production.conf /etc/nginx/nginx.conf
VOLUME /static
