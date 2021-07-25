#!/bin/bash

sudo rm -rf data/*
docker-compose down
docker rmi latest123/login-app:latest
