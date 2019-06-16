/**
 * Classe abtraite d'intéraction avec des APIs
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
 */

import AbortController from 'abort-controller';

export default class Api {
	static GET = 'GET';

	static POST = 'POST';

	static PUT = 'PUT';

	static DELETE = 'DELETE';

	static HEADER_JSON = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};

	static HEADER_FORM_URLENCODED = {
		'Content-Type': 'application/x-www-form-urlencoded',
	};

	static VALID_STATUS = [200, 201, 204];

	constructor(url) {
		this.baseUrl = url;
		this.controller = new AbortController();
		this.signal = this.controller.signal;
	}

	static serialize(queries) {
		const str = [];

		for (const query in queries) {
			if (queries.hasOwnProperty(query))
				str.push(`${encodeURIComponent(query)}=${encodeURIComponent(queries[query])}`);
		}

		return str.join('&');
	}

	static urlWithQueries(url, queries) {
		if (queries === undefined || queries.length === 0 || queries === '') {
			return url;
		}

		return `${url}?${Api.serialize(queries)}`;
	}

	call(request, method, queries, body, headers, validStatus, json = false) {
		const parameters = {
			credentials: 'include',
			method: method || Api.GET,
			headers: headers || {},
			signal: this.signal,
		};

		if (method !== 'GET') {
			parameters.body = JSON.stringify(body);
		}

		return new Promise((resolve, reject) => {
			fetch(Api.urlWithQueries(this.baseUrl + request, queries), parameters)
				.then(response => {
					const toReturn = data => {
						if ((validStatus || Api.VALID_STATUS).includes(response.status)) {
							return resolve([data, response.status]);
						}

						return reject([data, response.status]);
					};

					if (json) {
						return response.json().then(toReturn);
					}

					return response.text().then(toReturn);
				})
				.catch(e => {
					return reject([e.message, 523]);
				});
		});
	}

	abortRequest() {
		this.controller.abort();
	}
}
