var config = require("../../shared/config");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;

function PoolsListViewModel(items) {
	var viewModel = new ObservableArray(items);

	viewModel.load = function() {
		var url = config.apiURI + "PoolList.cfm";
		return fetch(url)
		.then(handleErrors)
		.then(function(data) {
			var parsedData = JSON.parse(data._bodyInit);
			var pools = parsedData.pools;
			pools.forEach(function(pool) {
				viewModel.push({
					name: pool.name,
					id: pool.id,
					typeId: pool.typeid
				});
			});
			return viewModel._array;
		})
		.catch(function(error) {
			console.log("ERROR: " + error);
		})
	};

	viewModel.empty = function() {
	    while (viewModel.length) {
	        viewModel.pop();
	    }
	};

	// viewModel.makeNamesList = function() {
	// 	var namesList = [];
		// pools.forEach(function(pool) {
		// 	// namesList.push(pool.name);
		// 	// console.log(pool.name);
		// 	// console.log(namesList);
		// });
		// console.dump(namesList);
		// return namesList;
	// };

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