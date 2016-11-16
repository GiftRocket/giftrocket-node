'use strict';

var _ = require('lodash');
var request = require('request');

var GiftRocket = module.exports = function(accessToken) {
  if (_.isNil(accessToken)) {
    throw new Error('GiftRocket "accessToken" required');
  } else {
    this.accessToken = accessToken;
  }
};

// Orders
GiftRocket.prototype.createOrder = _.partial(client, 'orders', "POST");
GiftRocket.prototype.getOrders = _.partial(client, 'orders', "GET");
GiftRocket.prototype.getOrder = function(order_id, callback) {
  return client.call(this, 'orders/' + order_id, "GET", {}, callback)
};

// Gifts
GiftRocket.prototype.getGifts = _.partial(client, 'gifts', "GET");
GiftRocket.prototype.getGift = function(gift_id, callback) {
  return client.call(this, 'gifts/' + gift_id, "GET", {}, callback)
};

// Styles
GiftRocket.prototype.getStyles = _.partial(client, 'styles', "GET", {});

// FundingSources
GiftRocket.prototype.getFundingSources = _.partial(client, 'funding_sources', "GET", {});

function client(path, method, options, callback) {
  var opts = _.merge({}, {
    access_token: this.accessToken,
  }, options);

  var data = _.merge({}, {
    url: "https://www.giftrocket.com/api/v1/" + path,
    method: method,
    headers: {
      "User-agent": "Plaid Node v1.1.0"
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
