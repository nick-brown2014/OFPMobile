var frameModule = require("ui/frame");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var PoolsListViewModel = require("../../shared/view-models/pools-list-view-model");
var SessionsViewModel = require("../../shared/view-models/session-view-model");

var poolsList = new PoolsListViewModel([]);
var sessionsViewModel = new SessionsViewModel();

var pageData = new Observable ({
	poolsList: poolsList
})

exports.loaded = function(args) {
	
	page = args.object;
	page.bindingContext = pageData;

	button = page.getViewById("poolsButton");
	button.bindingContext = sessionsViewModel;

	poolsList.empty();
	poolsList.load();

	sessionsViewModel.getCurrentPool();

}

exports.selectPool = function(event) {
	var poolView = event.object;
	var pool = poolView.bindingContext;
	sessionsViewModel.setSession(pool.id, pool.name);
	frameModule.topmost().navigate("views/standings/standings");
}