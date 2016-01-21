'use strict';

function TimestampController () {

	this.convert = function (req, res) {
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
	};

}

module.exports = TimestampController;
