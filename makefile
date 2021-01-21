main:
	cat .env.prd > .env.local
	npm run build
	cat .env.dev > .env.local
	docker build -t registry.cn-hangzhou.aliyuncs.com/douyacun/tea-ui:latest .
	docker push registry.cn-hangzhou.aliyuncs.com/douyacun/tea-ui:latest
	ssh d2 < ./deployments/deploy.sh