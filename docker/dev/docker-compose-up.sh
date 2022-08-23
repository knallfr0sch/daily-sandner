#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker volume create --name=daily-sandner-postgres-volume --label=daily-sandner-postgres-volume
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d

