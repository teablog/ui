main:
	npm run build
	docker build -t registry.cn-hangzhou.aliyuncs.com/douyacun/tea-ui:latest .
	docker push registry.cn-hangzhou.aliyuncs.com/douyacun/tea-ui:latest
	ssh d2 < ./deployments/deploy.sh