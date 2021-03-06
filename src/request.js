import axios from 'axios';
import https from 'https';
import {ltrim, rtrim} from './utils';

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

async function request(params) {
	if (!params["url"].startsWith("http") && process.env.NEXT_PUBLIC_HOST) {
		params['url'] = process.env.NEXT_PUBLIC_HOST + "/" + ltrim(params['url'], "/")
	}
	params['withCredentials'] = true;
	
	const instance = axios.create({
		httpsAgent: new https.Agent({  
			rejectUnauthorized: false
		})
	});
	if (params["noCheck"]) {
		return instance(params)
	}
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
