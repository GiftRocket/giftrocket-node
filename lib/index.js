'use strict';

var _ = require('lodash');
var request = require('request');

var GiftRocket = module.exports = {};

GiftRocket = function(access_token) {
  if (_.isNil(access_token)) {
    throw new Error('GiftRocket "access_token" required');
  } else {
    this.access_token = access_token;
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
  return request({
    uri: "https://giftrocket.com/api/v1/" + path,
    method: method,
    json: _.merge({}, {
      access_token: this.access_token,
    }, options),
  }, handleResponse(callback));
};

function handleResponse(callback) {
  function handler(err, res, body) {
    err == null ?
      callback(null, body) :
      callback(err, null);
  }

  // If a callback is not specified, noop.
  return callback ? handler :  function() {};
}
