base-images:
	docker build --file Docker/poet-base.dockerfile --tag poet-base:latest .
	docker build --file Docker/poet-web-base.dockerfile --tag poet-web-base:latest .

staging: base-images
	cd Docker && cp docker-compose-staging.yaml docker-compose.yaml
	cd Docker && docker-compose build

development: base-images
	cd Docker && cp docker-compose-development.yaml docker-compose.yaml
	cd Docker && docker-compose build

start:
	cd Docker && docker-compose up
