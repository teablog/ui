import axios from 'axios';
// import generateNginxAccessToken from './nginxAccessToken';
import https from 'https';
import {HOST} from "./config";

function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		return { "code": response.code, "msg": "发生错误了哟～" }
	}
}

/**
 * 解析json
 * @param response
 */
function parseJson(response) {
	return response.data
}
function ltrim(str) {
	if (str && str.startsWith('/')) {
		return str.slice(1);
	}
	return str;
}
async function request(params) {
	if (!params["url"].startsWith("http")) {
		params['url'] = HOST + ltrim(params['url'])
	}
	params['withCredentials'] = true;
	const instance = axios.create({
		httpsAgent: new https.Agent({  
			rejectUnauthorized: false
		})
	});
	return instance(params).then(checkStatus).then(parseJson)
}

export function GET(params) {
	return request({ ...params, method: "GET" })
}

export function POST(params) {
	return request({ ...params, method: "POST" });
}

export function PUT(params) {
	return request({ ...params, method: "PUT" });
}

export function DELETE(params) {
	return request({ ...params, method: "DELETE" });
}
