var config = require("../../shared/config");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;

function PoolsListViewModel(items) {
	var viewModel = new ObservableArray(items);

	viewModel.load = function() {
		var url = config.apiURI + "session.cfm";
		return fetch(url)
		.then(handleErrors)
		.then(function(data) {
			var parsedData = JSON.parse(data._bodyInit);
			var pools = parsedData.poolsArray;
			pools.forEach(function(pool) {
				viewModel.push({
					name: pool.poolname,
					id: pool.poolid
				});
			});
		})
		.catch(function(error) {
			console.log("ERROR: " + error);
		});
	};

	viewModel.empty = function() {
	    while (viewModel.length) {
	        viewModel.pop();
	    }
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

module.exports = PoolsListViewModel;