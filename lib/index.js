'use strict';

var _ = require('lodash');
var request = require('request');
var jwt = require('jsonwebtoken');

var GiftRocket = module.exports = function(accessToken, domain) {
  if (_.isNil(accessToken)) {
    throw new Error('GiftRocket "accessToken" required');
  } else {
    this.accessToken = accessToken;
    this.domain = domain || "https://www.giftrocket.com";
  }
};

// Organizations
GiftRocket.prototype.createOrganization = _.partial(client, 'organizations', "POST");
GiftRocket.prototype.getOrganizations = _.partial(client, 'organizations', "GET", {});

// Organization Members
GiftRocket.prototype.createOrganizationMember = function(accountId, options, callback) {
  return client.call(this, 'organizations/' + accountId + '/members', "POST", options, callback);
};
GiftRocket.prototype.getOrganizationMembers = function(accountId, callback) {
  return client.call(this, 'organizations/' + accountId + '/members', "GET", {}, callback);
};

// Orders
GiftRocket.prototype.createOrder = _.partial(client, 'orders', "POST");
GiftRocket.prototype.getOrders = _.partial(client, 'orders', "GET");
GiftRocket.prototype.getOrder = function(orderId, callback) {
  return client.call(this, 'orders/' + orderId, "GET", {}, callback);
};

// Gifts
GiftRocket.prototype.getGifts = _.partial(client, 'gifts', "GET");
GiftRocket.prototype.getGift = function(giftId, callback) {
  return client.call(this, 'gifts/' + giftId, "GET", {}, callback);
};

// Styles
GiftRocket.prototype.getStyles = _.partial(client, 'styles', "GET");

// FundingSources
GiftRocket.prototype.getFundingSources = _.partial(client, 'funding_sources', "GET");

// Tokenize for the embedded client
GiftRocket.prototype.tokenizeEmbed = function(payload) {
  return jwt.sign(payload, this.accessToken, {algorithm: "HS256"});
};

function client(path, method, options, callback) {
  var opts = _.merge({}, {
    access_token: this.accessToken,
  }, options);

  var data = _.merge({}, {
    url: this.domain + "/api/v1/" + path,
    method: method,
    headers: {
      "User-agent": "Plaid Node v2.0.0"
    },
    json: true
  }, method == "GET" ? {qs: opts} : {json: opts});

  return request(data, handleResponse(callback));
};

function handleResponse(callback) {
  function handler(err, res, body) {
    if (err) {
      callback(err, null);
    } else if (res.statusCode != 200) {
      callback(body, null);
    } else {
      callback(null, body);
    }
  }

  // If a callback is not specified, noop.
  return callback ? handler : function() {};
};
