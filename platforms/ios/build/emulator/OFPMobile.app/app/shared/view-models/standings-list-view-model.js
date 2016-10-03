var config = require("../../shared/config");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;

function StandingsListViewModel(items) {
	var viewModel = new ObservableArray(items);

	viewModel.load = function() {
		var url = config.apiURI + "getStandings.cfm?weekid=397";
		return fetch(url)
		.then(handleErrors)
		.then(function(data) {
			var parsedData = JSON.parse(data._bodyInit);
			var users = parsedData.users;
			// console.dump(users);
			users.forEach(function(standing) {
				viewModel.push({
					place: standing.place,
					username: standing.username,
					record: standing.record
				});
			});
			// console.dump(users);
			// viewModel.checkArray();
			viewModel.prepareStandings();
		})
		.catch(function(error) {
			console.log("ERROR: " + error);
		});
	};

	viewModel.prepareStandings = function() {
		var array = viewModel._array;
		array.forEach(function(entry) {
			var index = array.indexOf(entry);
			var joinedRecord = ""
			entry.place = entry.place + ": ";
			entry.record.forEach(function(standing) {
				joinedRecord = joinedRecord + standing + " - ";
			});
			joinedRecord = joinedRecord.slice(0, -3);
			array[index].joinedRecord = joinedRecord;
		});
	}

	viewModel.empty = function() {
	    while (viewModel.length) {
	        viewModel.pop();
	    }
	};

	viewModel.checkArray = function() {
		console.dump(viewModel._array);
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

module.exports = StandingsListViewModel;