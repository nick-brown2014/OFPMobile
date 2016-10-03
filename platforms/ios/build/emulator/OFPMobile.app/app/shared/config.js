var config = {};

config.apiProtocol = "http";
config.apiHostname = "192.168.15.99";
config.apiServerURL = config.apiProtocol +  "://" + config.apiHostname;
config.apiURI = config.apiServerURL + "/ofp/api/v1/";

module.exports = config;
