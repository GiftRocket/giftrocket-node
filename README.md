giftrocket-node
==============

A thin node.js client library for the [GiftRocket API][1].

## Installation

```console
$ npm install giftrocket
```

## Getting started

All API requests require an access token.  A sandbox access token is assigned upon signup through the [GiftRocket Dashboard][2]. Once you are ready to move to production, you will be assigned a production access token.

### Authentication

```javascript
var GiftRocket = require('giftrocket');
var client = new GiftRocket("[YOUR_ACCESS_TOKEN]");
```


### Orders

See [API documentation][3] for all Order options.  Use the FoundingSources resource to look up a valid method for your payment (i.e. credit card, ACH, etc).

```javascript
// Create a new order, specifying your gift options
// as an array of objects.
client.createOrder({
  "funding_source_id": "[FUNDING_SOURCE_ID]",
  "gifts": [
    {
      "amount": 40,
      "message": "Such a great way to show appreciation to others!",
      "recipient": {
        "email": "person@yourteam.com",
        "name": "Person Example"
      },
      "style_id": "thank_you_tree"
    }
  ]
}, function(err, results) {
  console.log(JSON.stringify(results, null, 2));
});

// Return historical orders, optionally passing a starting offset for results.
client.getOrders({offset: 10}, function(err, results) {
  console.log(JSON.stringify(results, null, 2));
});

// Return a order by order_id
client.getOrder("[ORDER_ID]", function(err, result) {
  console.log(JSON.stringify(result, null, 2));
});
```

### Funding Sources
Production funding sources must be added through the web dashboard. A sandbox funding source is provided during development.

```javascript
// Retrieve a list of your funding sources (credit card, ach, etc).
client.getFundingSources(function(err, results) {
  console.log(JSON.stringify(results, null, 2));
});
```

### Styles
A style defines the presentation of your gift.  The styles endpoint returns an array of card designs.

```javascript
client.getStyles(function(err, results) {
  console.log(JSON.stringify(results, null, 2));
});
```

### Gifts
Retrieve a single or many historical gifts sent by your account.

```javascript
client.getGifts({offset: 10}, function(err, results) {
  console.log(JSON.stringify(results, null, 2));
});

client.getGift("[GIFT_ID]", function(err, results) {
  console.log(JSON.stringify(results, null, 2));
});
```

[1]: https://giftrocket.com/docs
[2]: https://giftrocket.com/rewards
[3]: https://giftrocket.com/docs
