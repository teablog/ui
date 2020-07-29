#!/bin/bash

docker build -t registry.cn-hangzhou.aliyuncs.com/douyacun/tea-ui:latest .
docker push registry.cn-hangzhou.aliyuncs.com/douyacun/tea-ui:latest
