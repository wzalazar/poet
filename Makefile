build:
	docker build --file Docker/poet-base.dockerfile --tag poet-base:latest .
	cd Docker
	docker-compose build
