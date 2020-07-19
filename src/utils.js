export function ltrim(str, char) {
	if (str && str.startsWith(char)) {
		return str.slice(char.length);
	}
	return str;
}
export function rtrim(str, char) {
	if (str && str.endsWith(char)) {
		return str.slice(0, -char.length);
	}
	return str;
}

