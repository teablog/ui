#!/bin/bash

sudo docker pull registry.cn-hangzhou.aliyuncs.com/douyacun/tea-ui:latest
pushd /data/web/ui
sudo git pull
sudo cnpm install
popd
pushd /data/web/ui/deployments/ui
sudo docker-compose up --force-recreate -d
popd
echo y|sudo docker image prune