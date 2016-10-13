var config = require("../../shared/config");
var Observable = require("data/observable").Observable;

function User(info) {
	info = info || {};

	var viewModel = new Observable({
		email: info.email || "",
		password: info.password || ""
	});

	viewModel.login = function() {
		// var fd = new FormData();
        // fd.append("username", viewModel.get("email"));
        // fd.append("password", viewModel.get("password"));
        var url = config.apiURI + "login.cfm";
		return fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				username: viewModel.get("email"),
				password: viewModel.get("password")
			}),
			headers: {
				"Content-Type": "application/json"
			}
		})
		.then(handleErrors)
		.catch(function(error) {
			console.log(error);
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