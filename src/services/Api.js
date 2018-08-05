export default class Api {
    static GET = 'GET'
    static POST = 'POST'
    static PUT = 'PUT'
    static DELETE = 'DELETE'

    static HEADER_JSON = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }

    static VALID_STATUS = [
        200, 201, 204
    ]

    constructor(url) {
        this.baseUrl = url
    }

    serialize(queries) {
        var str = [];

        for (var query in queries) {
            if (queries.hasOwnProperty(query))
                str.push(encodeURIComponent(query) + "=" + encodeURIComponent(queries[query]))
        }

        return str.join("&")
    }

    urlWithQueries(url, queries) {
        if (queries === undefined || queries.length === 0 || queries == "")
            return url
	else
        return url + '?' + this.serialize(queries)
    }

    call(request, method, queries, body, headers, validStatus, json=false) {
	var parameters = {
            method: method || Api.GET,
            headers: headers || {},
        }
	
	if (method != 'GET') {parameters.body = JSON.stringify(body);}

	return new Promise((resolve, reject) => {

	fetch(this.urlWithQueries(this.baseUrl + request, queries), parameters).then( (response) => {
				if ((validStatus || Api.VALID_STATUS).includes(response.status)) {
						if(json) {
							response.json().then( (data) => {resolve([data, response.status]);  } );
						}
						else {
							response.text().then( (text) => {resolve([text, response.status]);  } );
						}
				}
				else {
					response.text().then( (text) => { reject([text, response.status]); }); 
				}
			}).catch( (e) => {reject([e.message, 523]);} );

	});
    }
}
