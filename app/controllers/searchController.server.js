'use strict';

var Searches = require('../models/searches.js');

//var google = require('../lib/googleapis.js');
var google = require('googleapis');
var customsearch = google.customsearch('v1');

function SearchController () {

	this.getLatestSearches = function (req, res) {
		Searches
			.find({}, { '_id': false, '__v': false }).sort('-when').limit(10)
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result);
			});
	};

	this.search = function (req, res) {
		var query = req.params[0];
		var start = 1;
		if (req.query.offset) {
			start = req.query.offset;
		}
		Searches
			.create({ 'term': query, when: Date.now() }, function (err, result) {
				if (err) { throw err; }
				customsearch.cse.list({ cx: process.env.CX, q: query, auth: process.env.API_KEY, start: start }, function(err, resp) {
				  if (err) {
				    console.log('An error occured', err);
				    return;
				  }
				  // Got the response from custom search
				  console.log('Result: ' + resp.searchInformation.formattedTotalResults);
				  if (resp.items && resp.items.length > 0) {
				    var mapped = resp.items.map(function(item) {
				    	var thumbnail = null;
				    	if (item["pagemap"]["cse_thumbnail"]) {
				    		thumbnail = item["pagemap"]["cse_thumbnail"][0].src;
				    	}
				    	return {
							//"url" : item["pagemap"]["imageobject"][0].url,
							"url" : item["pagemap"]["cse_image"][0].src,
							"snippet" : item["snippet"],
							"thumbnail" : thumbnail,
							"context" : item["link"]
						};
				    });
				    res.json(mapped);
				    //res.json(resp.items);
				  }
				});
			}
		);
	};


}

module.exports = SearchController;
