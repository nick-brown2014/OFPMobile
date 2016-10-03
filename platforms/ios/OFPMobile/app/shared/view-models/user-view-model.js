var config = require("../../shared/config");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;

function User(info) {
	info = info || {};

	var viewModel = new Observable({
		email: info.email || "",
		password: info.password || ""
	});

	viewModel.login = function() {
		var fd = new FormData();
        fd.append("username", viewModel.get("email"));
        fd.append("password", viewModel.get("password"));
        var url = config.apiURI + "login.cfm";
		return fetchModule.fetch(url, {
			method: 'POST',
			body: fd
		})
		.then(handleErrors)
		.then(function(response) {
	    	return response.json();
		})
		// .then(function(data) {
		// })
		.catch(function(error) {
			console.log("ERROR: " + error);
		});
	};

	return viewModel;

}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = User;