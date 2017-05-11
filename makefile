development: base-images
	cd Docker && docker-compose build

poet-js:
	cd Docker && docker-compose -f docker-compose.yml -f docker-compose.poet-js.yml build

staging: base-images
	cd Docker && docker-compose -f docker-compose.yml -f docker-compose.staging.yml build

base-images: prepare
	docker build --file Docker/poet-base.dockerfile --tag poet-base:latest .

prepare:
	mkdir -p node/torrents
	mkdir -p Docker/postgres

start: prepare
	cd Docker && docker-compose up

stop:
	cd Docker && docker-compose stop

down:
	cd Docker && docker-compose down

daemon: prepare
	cd Docker && docker-compose up -d

psql:
	cd Docker && docker-compose exec db /usr/bin/psql -U poet

bash-web:
	cd Docker && docker-compose exec web /bin/bash

bash-explorer:
	cd Docker && docker-compose exec explorer /bin/bash

setup-cron:
	{ crontab -l; echo "*/5 * * * * export PATH=$PATH:/usr/loval/bin && cd /home/ubuntu/poet && /usr/bin/bash ./utils/fetch_and_reload.sh >> /dev/null" } | crontab -
