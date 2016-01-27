'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var UrlController = require(path + '/app/controllers/urlController.server.js'); // 03 URL
var SearchController = require(path + '/app/controllers/searchController.server.js'); // 04 IMAGESEARCH
var accepts = require('accepts'); // 02 WHOAMI
var uaParser = require('ua-parser'); // 02 WHOAMI
var multer  = require('multer'); // 05 METADATA
var upload = multer({ }); // 05 METADATA
//  02 WHOAMI: npm install --save accepts ua-parser
//  03 URL: npm install --save valid-url
//  04 IMAGESEARCH: npm install --save googleapis
//  05 METADATA: npm install --save multer

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();
	var urlController = new UrlController(); // 03 URL
	var searchController = new SearchController(); // 04 IMAGESEARCH

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
/* 01 TIMESTAMP BEGIN */
	app.route('/api/convert/:input')
		.get(isLoggedIn, function (req, res) {
			var intConvert = parseInt(req.params.input);
			var dateConvert = Date.parse(req.params.input);

			if (!isNaN(intConvert)) {
				res.json({
					"unix": req.params.input,
					"natural": (new Date(intConvert * 1000)).toDateString()
				});
			} else if (dateConvert) {
				res.json({
					"unix": Math.floor(dateConvert / 1000),
					"natural": req.params.input
				});
			} else {
				res.json({
					"unix": null,
					"natural": null
				});
			}
		});
/* 01 TIMESTAMP END */
/* 02 WHOAMI BEGIN */
	app.route('/api/whoami')
		.get(/*isLoggedIn, */function (req, res) {
			//var userAgent = req.get('User-Agent');
			var userAgent = req.headers['user-agent'];
			res.json({
				"ipaddress": req.connection.remoteAddress,
				"language": accepts(req).languages()[0],
				"software": uaParser.parseOS(userAgent).toString()
			});
		});
/* 02 WHOAMI END */
/* 03 URL BEGIN */
	app.route('/api/new/*?')
		.get(/*isLoggedIn, */urlController.addUrl);
	app.route('/api/url/:id')
		.get(/*isLoggedIn, */urlController.getUrl);
/* 03 URL END */
/* 04 IMAGESEARCH BEGIN */
	app.route('/api/search/*?')
		.get(/*isLoggedIn, */searchController.search);
	app.route('/api/latest')
		.get(/*isLoggedIn, */searchController.getLatestSearches);
/* 04 IMAGESEARCH END */
/* 05 METADATA BEGIN */
	//app.route('/')
	app.route('/api/fileanalyse/')
		.get(function (req, res) {
			res.sendFile(path + '/public/multi.html');
 		});
 
		app.post('/api/fileanalyse/', upload.single('0'), function (req, res, next) {
			res.json({"fileSize": req.file.size});
		});
/* 05 METADATA END */

	/*app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);*/
};
