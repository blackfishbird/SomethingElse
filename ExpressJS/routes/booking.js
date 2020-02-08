var express = require('express');
var router = express.Router();
var db = require('../db');

// HTTP
var http = require('http');
var bodyParser = require('body-parser');

// HTTP
var port = process.env.PORT || 9250;
var host = process.env.HOST || "127.0.0.1";
var server = http.createServer(router).listen(port, host, function() {
	console.log("Server listening to %s: %d within %s environment", host, port, router.get('env'));
});


Date.prototype.format = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小時
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" +  k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" +  o[k]).substr(("" + o[k]).length)));
	return fmt;
};

/* GET booking listing. */
router.get('/', function(req, res, next) {
	// res.send('respond with a resource booking');
	var list = [];
	db.query('SELECT * FROM `booking`', function(err, rows, fields) {
		if(err) throw err;
		// console.log(rows);

		for(var i = 0; i < rows.length; i++) {
			var r = {
				id: rows[i].id,
				name: rows[i].name,
				start: rows[i].dt_start,
				end: rows[i].dt_end
			}
			list.push(r);
		}
		// console.dir(list);

		res.render('booking', {
			title: 'Booking',
			list: list
		});
	});
});

router.post('/add', function(req, res, next) {
	var start = req.body.startdate + ' ' + req.body.starttime;
	var startd = new Date(start);
	// startd.setHours(startd.getHours() + 8);
	startd.setMinutes(0);
	startd.setSeconds(0);
	var endd = new Date(start);
	// endd.setHours(endd.getHours() + 9);
	endd.setHours(endd.getHours() + 1);
	endd.setMinutes(0);
	endd.setSeconds(0);
	var result = {
		name: req.body.name,
		start: startd.format('yyyy-MM-dd hh:mm:ss'),
		end: endd.format('yyyy-MM-dd hh:mm:ss')
	};
	console.dir('su');
	console.dir(result);

	db.query("INSERT INTO booking (name, dt_start, dt_end, timestamp) VALUES ('" + result.name + "', '" + result.start + "', '" + result.end + "', NOW())", function(err, dbres) {
		if(err) throw err;
		console.dir(dbres)
		res.json(result);
	});
});

module.exports = router;