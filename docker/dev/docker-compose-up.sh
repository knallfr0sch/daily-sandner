#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker volume create --name=daily-sandner-postgres-volume --label=daily-sandner-postgres-volume

# Start only database
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d daily-sandner-postgres

# Wait ready datatbase
until docker exec -it $(docker ps -aqf "name=daily-sandner-postgres") pg_isready -U postgres; do
    echo "Waiting for postgres..."
    sleep 2
done

# Migrate database
npm run migrate:dev

# Start all services
# docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d
