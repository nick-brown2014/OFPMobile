var config = require("../../shared/config");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;
var fileSystemModule = require("file-system");
var fileName = 'sessionData.json';
var file = fileSystemModule.knownFolders.documents().getFile(fileName);


function Session(info) {
	info = info || {};

	var viewModel = new Observable({
		hasSession: info.hasSession || false,
		poolName: info.poolName || ""
	});

	viewModel.clearSession = function() {
		file.remove();
	}

	viewModel.setSession = function(poolId, poolName) {
		file.readText()
		.then(function(content) {
			parsedContent = JSON.parse(content);
			parsedContent.poolid = poolId;
			parsedContent.poolname = poolName;
			// console.log("Set Session");
			// console.dump(parsedContent);
			file.remove();
			file.writeText(JSON.stringify(parsedContent));
		});
		var url = config.apiURI + "session.cfm?poolid=" + poolId;
		return fetch(url, {
			method: "GET"
		})
		.then(handleErrors)
		.then(function(data) {
			var parsedData = JSON.parse(data._bodyInit);
		})
		.catch(function(error) {
			console.log("ERROR: " + error);
		});
	}

	viewModel.getCurrentPool = function() {
		file.readText()
		.then(function(content) {
			var parsedContent = JSON.parse(content);
			viewModel.poolName = parsedContent.poolname.toUpperCase() + " (" + parsedContent.poolid + ")";
		});
	}

	viewModel.fetchSession = function() {
		var url = config.apiURI + "session.cfm";
		return fetch(url)
		.then(function(response) {
			var sessionData = JSON.parse(response._bodyInit);
			var possiblePools = sessionData.poolsArray;
			var currentPoolName = "";
			possiblePools.forEach(function(pool) {
				if (pool.poolid === sessionData.poolid) {
					currentPoolName = pool.poolname;
				};
			});
			var sessionString = JSON.stringify({"memberid": sessionData.memberid, "poolid": sessionData.poolid, "poolname": currentPoolName});
			file.writeText(sessionString);
		});
	}

	return viewModel;

}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = Session;