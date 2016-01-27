'use strict';

var Urls = require('../models/urls.js');
var validUrl = require('valid-url');

function UrlController () {

	this.getUrl = function (req, res) {
		Urls
			.findOne({ '_id': req.params.id })
			.exec(function (err, result) {
				if (err) { throw err; }
				res.redirect(result.url);
			});
	};

	this.addUrl = function (req, res) {
		console.log("new url: " + req.params[0]);
		// TODO return url with base url!
		var allowInvalid = req.query.allow && req.query.allow == "true";
		if (validUrl.isUri(req.params[0]) || allowInvalid) {
			Urls
				.findOne({ 'url': req.params[0] })
				.exec(function (err, result) {
					if (err) { throw err; }
					if (result) {
						res.json({ "original_url": req.params[0], "short_url": result.id });
					} else {
						Urls
							.create({ 'url': req.params[0] }, function (err, result) {
									if (err) { throw err; }
									res.json({ "original_url": req.params[0], "short_url": result.id });
								}
							);
					}
				});
		} else {
			res.status(500).send("Invalid url " + req.params[0]);
		}
	};

}

module.exports = UrlController;
