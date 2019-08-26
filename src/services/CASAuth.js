/**
 * Intéragir avec le CAS UTC.
 *
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license GPL-3.0
 */

import { Alert } from 'react-native';
import { CAS_URL } from '../../config';

import Api from './Api';
import Storage from './Storage';

class CASAuth extends Api {
	constructor(url = CAS_URL) {
		super(url);
	}

	call(request, method, queries, body, headers, validStatus) {
		return new Promise((resolve, reject) => {
			return fetch(Api.urlWithQueries(this.baseUrl + request, queries), {
				method: method || Api.GET,
				headers: headers || {},
				body: Api.serialize(body),
			})
				.then(response => {
					if ((validStatus || Api.VALID_STATUS).includes(response.status)) {
						return response.text().then(text => {
							return resolve([text, response.status, response.url]);
						});
					}

					return response.text().then(text => {
						return reject([text, response.status, response.url]);
					});
				})
				.catch(e => {
					return reject([e.message, 523, '']);
				});
		});
	}

	isConnected() {
		return this.ticket && this.ticket.length > 0;
	}

	setData(login, password) {
		return this.login(login, password).then(() => {
			return Storage.setSensitiveData('cas', {
				login,
				password,
				ticket: this.ticket,
			});
		});
	}

	forget() {
		this.ticket = '';

		return Storage.removeSensitiveData('cas');
	}

	// eslint-disable-next-line class-methods-use-this
	getData() {
		return Storage.getSensitiveData('cas');
	}

	// eslint-disable-next-line class-methods-use-this
	getLogin() {
		return Storage.getSensitiveData('cas').then(data => {
			return data.login;
		});
	}

	setTicket(ticket) {
		this.ticket = ticket;
	}

	getTicket() {
		return this.ticket;
	}

	isTicketValid(ticket) {
		return this.call(ticket, Api.GET).then(() => {
			this.ticket = ticket;

			return true;
		});
	}

	login(login, password) {
		return this.call(
			'',
			Api.POST,
			'',
			{
				username: login,
				password,
			},
			CASAuth.HEADERS_FORM_URLENCODED,
			[201]
		)
			.then(([response, status, url]) => {
				this.ticket = CASAuth.parseTgt(response);

				return [response, status, url];
			})
			.catch(CASAuth.error);
	}

	getServiceTicket(service, queries) {
		return this.call(
			this.ticket,
			Api.POST,
			{},
			{
				service: Api.urlWithQueries(service, queries),
			},
			CASAuth.HEADERS_FORM_URLENCODED,
			[200]
		).catch(CASAuth.error);
	}

	static error(e) {
		console.warn(e);

		if (e instanceof TypeError) {
			return [JSON.stringify(e), 523, ''];
		}

		if (Array.isArray(e) && e.length === 3) {
			const [a, b, c] = e;

			return [JSON.stringify(a), JSON.stringify(b), JSON.stringify(c)];
		}

		return ['Erreur réseau', 523, ''];
	}

	static parseTgt(content) {
		try {
			const start = content.indexOf('tickets//') + 8;
			const end = content.indexOf('"', start);

			return content.substring(start, end);
		} catch (e) {
			Alert.alert('CAS', 'Une erreur CAS a été rencontrée', [{ text: 'Continuer' }], {
				cancelable: false,
			});
		}
	}
}

export default new CASAuth();
