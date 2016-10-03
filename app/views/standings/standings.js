var dialogsModule = require("ui/dialogs");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var StandingsListViewModel = require("../../shared/view-models/standings-list-view-model");
// var PoolsListViewModel = require("../../shared/view-models/pools-list-view-model");
var page;

// var poolsList = new PoolsListViewModel([]);
var standingsList = new StandingsListViewModel([]);
var pageData = new Observable({
	standingsList: standingsList
	// poolsList: poolsList
});

exports.loaded = function(args) {
	page = args.object;
	page.bindingContext = pageData;

	standingsList.empty();
	standingsList.load();
	// poolsList.load();
};
