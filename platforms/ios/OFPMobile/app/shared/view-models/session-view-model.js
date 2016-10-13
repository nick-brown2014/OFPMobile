var config = require("../../shared/config");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;
var applicationSettings = require("application-settings");


function Session(info) {
	info = info || {};

	var viewModel = new Observable();

	viewModel.clearSession = function() {
		applicationSettings.clear();
	}

	viewModel.setSession = function(poolId, poolName) {
		applicationSettings.setString("poolId", String(poolId));
		applicationSettings.setString("poolName", poolName);		
		var url = config.apiURI + "session.cfm";
		var fd = new FormData();
        fd.append("poolid", poolId);
		return fetch(url, {
			method: "POST",
			mode: "cors",
			body: fd,
			headers: {
				"Content-Type": "text/html"
			}
		})
		.then(handleErrors)
		.then(function(data) {
			var parsedData = JSON.parse(data._bodyInit);
			console.dump(parsedData);
		})
		.catch(function(error) {
			console.log("ERROR: " + error);
		});
	}

	viewModel.getCurrentPool = function() {
		applicationSettings.getString("poolName");
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
			console.log(sessionData.memberid);
			console.log(currentPoolName);			
			applicationSettings.setString("poolId", sessionData.poolid);
			applicationSettings.setString("memberId", sessionData.memberid);			
			applicationSettings.setString("poolName", currentPoolName);
			var nameyName = applicationSettings.getString("poolName");
			console.log ("nameyName = " + nameyName);
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