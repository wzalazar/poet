prepare:
	mkdir -p node/torrents
	mkdir -p Docker/postgres

base-images: prepare
	docker build --file Docker/poet-base.dockerfile --tag poet-base:latest .
	docker build --file Docker/poet-web-base.dockerfile --tag poet-web-base:latest .

staging: base-images
	cd Docker && cp docker-compose-staging.yaml docker-compose.yaml
	cd Docker && docker-compose build

development: base-images
	cd Docker && cp docker-compose-development.yaml docker-compose.yaml
	cd Docker && docker-compose build

start: prepare
	cd Docker && docker-compose up

stop:
	cd Docker && docker-compose down

daemon: prepare
	cd Docker && docker-compose up -d

psql:
	cd Docker && docker-compose exec db /usr/bin/psql -U poet

scripting:
	cd Docker && docker-compose exec explorer /bin/bash

setup-cron:
	CRONENTRY=
	{ crontab -l; echo "*/5 * * * * /usr/bin/bash ~/poet/utils/fetch_and_reload.sh >> /dev/null" } | crontab -
