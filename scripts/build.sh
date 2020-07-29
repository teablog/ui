#!/bin/bash

CURDIR=$(cd "$(dirname "$0")"; pwd) 

docker build -t registry.cn-hangzhou.aliyuncs.com/douyacun/tea-ui:latest .
docker push registry.cn-hangzhou.aliyuncs.com/douyacun/tea-ui:latest
ssh douyacun < ${CURDIR}/deploy.sh