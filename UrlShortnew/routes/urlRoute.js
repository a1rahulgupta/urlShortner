
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var clickTracker = require('../models/clickTracker.js');
var Url = require('../models/url');
var config = require('../models/config');
var base58 = require('../models/base58.js');
const requestIp = require('request-ip');
var waterfall = require('async-waterfall');
var async = require('async');
var moment = require('moment');
var underscore = require('underscore');

router.post('/getUrlInfo', function (req, res, next) {
  var finalResponse = {};
  var todayDate = req.body.todayDate;
  finalResponse.shortUrl = req.body.shortUrl;
  finalResponse.todayClicks = 0;
  finalResponse.lastYearsCount = 0;
  finalResponse.lastOneMonthClicks = 0;
  finalResponse.lastHoursClicks = 0;
  var condition = {};
  waterfall([
    function (callback) {
      condition.shortUrl = finalResponse.shortUrl;
      clickTracker.find(condition).exec(function (err, longUrl) {
        if (err) {
          callback(err, false);
        } else {
          finalResponse.longUrl = longUrl;
          callback(null, finalResponse);
        }
      })
    },
    function (finalResponse, callback) { //Get facility Google link 
      var start_day_date = moment(todayDate).startOf('day');
      var end_day_date = moment(todayDate).endOf('day');
      var momentObjFrom = new Date(moment(start_day_date));
      var momentObjTo = new Date(moment(end_day_date));
      condition.shortUrl = finalResponse.shortUrl;
      condition.$and = [{
        onClickDate: {
          $gte: momentObjFrom
        }
      },
      {
        onClickDate: {
          $lte: momentObjTo
        }
      }
      ];
      clickTracker.find(condition).count().exec(function (err, todayCount) {
        if (err) {
          callback(err, false);
        } else {
          finalResponse.todayClicks = todayCount;
          callback(null, finalResponse);
        }
      })
    },
    function (finalResponse, callback) { //Get facility Google link 
      var start_day_date = moment(todayDate).startOf('hours');
      var end_day_date = moment(todayDate).endOf('hours');
      var momentObjFrom = new Date(moment(start_day_date));
      var momentObjTo = new Date(moment(end_day_date));
      condition.shortUrl = finalResponse.shortUrl;
      condition.$and = [{
        onClickDate: {
          $gte: momentObjFrom
        }
      },
      {
        onClickDate: {
          $lte: momentObjTo
        }
      }
      ];
      clickTracker.find(condition).count().exec(function (err, lastHoursClicks) {
        if (err) {
          callback(err, false);
        } else {
          finalResponse.lastHoursClicks = lastHoursClicks;
          callback(null, finalResponse);
        }
      })
    },

    function (finalResponse, callback) {

      var start_day_date = moment(req.body.todayDate).startOf('day').subtract(1, 'years');
      var end_day_date = moment(req.body.todayDate).endOf('day');
      var momentObjFrom = new Date(moment(start_day_date));
      var momentObjTo = new Date(moment(end_day_date));
      condition.shortUrl = finalResponse.shortUrl;
      condition.$and = [{
        onClickDate: {
          $gte: momentObjFrom
        }
      },
      {
        onClickDate: {
          $lte: momentObjTo
        }
      }
      ];
      clickTracker.find(condition).count().exec(function (err, lastYearsCount) {
        if (err) {
          callback(err, false);
        } else {
          finalResponse.lastYearsCount = lastYearsCount;
          callback(null, finalResponse);
        }
      })

    },

    function (finalResponse, callback) { //Get last 7 days click counts  
      var start_day_date = moment(req.body.todayDate).endOf('day').add(-30, 'days');;
      var end_day_date = moment(req.body.todayDate).endOf('day');
      var momentObjFrom = new Date(moment(start_day_date));
      var momentObjTo = new Date(moment(end_day_date));
      condition.shortUrl = finalResponse.shortUrl;
      condition.$and = [{
        onClickDate: {
          $gte: momentObjFrom
        }
      },
      {
        onClickDate: {
          $lte: momentObjTo
        }
      }
      ];
      clickTracker.find(condition).count().exec(function (err, lastOneMonthCount) {
        if (err) {
          callback(err, false);
        } else {
          finalResponse.lastOneMonthClicks = lastOneMonthCount;
          callback(null, finalResponse);
        }
      })

    },
  ], function (err, data) {
    if (err) {
      res.json({
        code: 400,
        data: {},
        message: "INTERNAL_ERROR"
      });
    } else {
      res.json({
        code: 200,
        data: data,
        message: "TRACKED_SUCCESSFULLY"
      });
    }
  });


  //   
});

router.post('/makeGraph', function (req, res, next) {
  if (req.body.period == 'days') {
    var finalResponse = {};
    finalResponse.dateArray = [];
    var countObj = {};
    var countObjIfNull = {};

    finalResponse.dateFormatArray = [
      {
        category: '0',
      }
    ];
    var start_day_date = moment(req.body.startDate).startOf('day');
    var end_day_date = moment(req.body.endDate).endOf('day');
    waterfall([
      function (callback) { //Set date array for last 61 days
        while (start_day_date <= end_day_date) {
          finalResponse.dateArray.push(moment(start_day_date))
          start_day_date = moment(start_day_date).add(1, 'days');
        }
        callback(null, finalResponse);
      },
      function (finalResponse, callback) {

        async.eachSeries(finalResponse.dateArray, function (singleDate, next) {

          var day_start_of_date = singleDate;
          var day_end_of_date = moment(singleDate).endOf('day');
          var momentObjFrom = new Date(moment(day_start_of_date));
          var momentObjTo = new Date(moment(day_end_of_date));
          var condition = {};
          condition.shortUrl = req.body.shortUrl;
          condition.$and = [{
            onClickDate: {
              $gte: momentObjFrom
            }
          },
          {
            onClickDate: {
              $lte: momentObjTo
            }
          }
          ];
          clickTracker.aggregate([{
            $match: condition
          }, {
            "$group": {
              "_id": "$shortUrl",
              "avgCount": {
                "$sum": {
                  "$ifNull": ["$clickCount", 0]
                }
              }
            }
          }], function (err, counts) {
            if (counts.length > 0) {
              countObj = {
                category: singleDate.format('MM-DD-YY'),
                count: counts[0].avgCount
              }
              finalResponse.dateFormatArray.push(countObj);
              next();
            } else {
              countObjIfNull = {
                category: singleDate.format('MM-DD-YY'),
                count: 0
              }
              finalResponse.dateFormatArray.push(countObjIfNull);
              next();
            }
          })
        }, function (err) {
          if (err) {
            callback(err, false);
          } else {
            callback(null, finalResponse);
          }
        })
      },
    ],
      function (err, data) {
        if (err) {
          res.json({
            code: 400,
            data: {},
            message: "INTERNAL_ERROR"
          });
        } else {
          res.json({
            code: 200,
            data: data,
            message: "DATA_FOUND_SUCCESSFULLY"
          });
        }
      });

  } else if (req.body.period == 'hours') {
    var startTimeDateObj = new Date(req.body.startDate);
    var startTimeHours = startTimeDateObj.getHours();
    var endTimeDateObj = new Date(req.body.endDate);
    var endTimeHours = endTimeDateObj.getHours();
    var finalResponse = {};
    finalResponse.dateArray = [];
    var countObj = {};
    var countObjIfNull = {};

    finalResponse.dateFormatArray = [
      {
        category: '0',
      }
    ];

    waterfall([
      function (callback) { //Set date array for last 61 days
        while (startTimeHours <= endTimeHours) {
          var startTimeDateObj1 = moment(startTimeDateObj);
          startTimeDateObj1.set({ h: startTimeHours, m: 0 });

          var endTimeDateObj1 = moment(startTimeDateObj);
          endTimeDateObj1.set({ h: startTimeHours + 1, m: 0 });

          var obj = {
            startTimeDateObj2: startTimeDateObj1,
            endTimeDateObj2: endTimeDateObj1
          }
          finalResponse.dateArray.push(obj);
          startTimeHours = startTimeHours + 1;
        }
        callback(null, finalResponse);
      },
      function (finalResponse, callback) {
        async.eachSeries(finalResponse.dateArray, function (singleDate, next) {
          var day_start_of_date = singleDate.startTimeDateObj2;
          var day_end_of_date = singleDate.endTimeDateObj2;
          var momentObjFrom = new Date(moment(day_start_of_date));
          var momentObjTo = new Date(moment(day_end_of_date));
          var condition = {};
          condition.shortUrl = req.body.shortUrl;
          condition.$and = [{
            onClickDate: {
              $gte: momentObjFrom
            }
          },
          {
            onClickDate: {
              $lte: momentObjTo
            }
          }
          ];
          clickTracker.aggregate([{
            $match: condition
          }, {
            "$group": {
              "_id": "$shortUrl",
              "avgCount": {
                "$sum": {
                  "$ifNull": ["$clickCount", 0]
                }
              }
            }
          }], function (err, counts) {
            if (counts.length > 0) {
              countObj = {
                category: (singleDate.startTimeDateObj2).hour(),
                count: counts[0].avgCount
              }
              finalResponse.dateFormatArray.push(countObj);
              next();
            } else {
              countObjIfNull = {
                category: (singleDate.startTimeDateObj2).hour(),
                count: 0
              }
              finalResponse.dateFormatArray.push(countObjIfNull);
              next();
            }
          })
        }, function (err) {
          if (err) {
            callback(err, false);
          } else {
            callback(null, finalResponse);
          }
        })
      },
    ],

      function (err, data) {
        if (err) {
          res.json({
            code: 400,
            data: {},
            message: "INTERNAL_ERROR"
          });
        } else {
          res.json({
            code: 200,
            data: data,
            message: "DATA_FOUND_SUCCESSFULLY"
          });
        }
      });

  } else if (req.body.period == 'months') {
    var finalResponse = {};
    finalResponse.dateArray = [];
    var countObj = {};
    var countObjIfNull = {};

    finalResponse.dateFormatArray = [
      {
        category: '0',
      }
    ];
    waterfall([
      function (callback) {
        var i = 0;
        while (i <= 11) {
          var obj = {
            monthName: moment().month(i.toString()).format('MMMM'),
            selectedDate: moment()
          }
          finalResponse.dateArray.push(obj)
          i++;
        }
        callback(null, finalResponse);
      },
      function (finalResponse, callback) {
        async.eachSeries(finalResponse.dateArray, function (singleDate, next) {
          var day_start_of_date = moment().month(singleDate.monthName).startOf('month');
          var day_end_of_date = moment().month(singleDate.monthName).endOf('month');
          var momentObjFrom = new Date(moment(day_start_of_date));
          var momentObjTo = new Date(moment(day_end_of_date));
          var condition = {};
          condition.shortUrl = req.body.shortUrl;
          condition.$and = [{
            onClickDate: {
              $gte: momentObjFrom
            }
          },
          {
            onClickDate: {
              $lte: momentObjTo
            }
          }
          ];
          clickTracker.aggregate([{
            $match: condition
          }, {
            "$group": {
              "_id": "$shortUrl",
              "avgCount": {
                "$sum": {
                  "$ifNull": ["$clickCount", 0]
                }
              }
            }
          }], function (err, counts) {
            if (counts.length > 0) {
              countObj = {
                category: singleDate.monthName,
                count: counts[0].avgCount
              }
              finalResponse.dateFormatArray.push(countObj);
              next();
            } else {
              countObjIfNull = {
                category: singleDate.monthName,
                count: 0
              }
              finalResponse.dateFormatArray.push(countObjIfNull);
              next();
            }
          })
        }, function (err) {
          if (err) {
            callback(err, false);
          } else {
            callback(null, finalResponse);
          }
        })
      },
    ],
      function (err, data) {
        if (err) {
          res.json({
            code: 400,
            data: {},
            message: "INTERNAL_ERROR"
          });
        } else {
          res.json({
            code: 200,
            data: data,
            message: "DATA_FOUND_SUCCESSFULLY"
          });
        }
      });
  } else {
    var finalResponse = {};
    finalResponse.dateArray = [];
    var countObj = {};
    var countObjIfNull = {};

    finalResponse.dateFormatArray = [
      {
        category: '0',
      }
    ];
    waterfall([
      function (callback) {
        var i = 0;
        while (i <= 4) {
          var obj = {
            year: moment().subtract(i, 'years').year(),
            selectedDate: moment()
          }
          finalResponse.dateArray.push(obj)
          i++;
        }
        callback(null, finalResponse);
      },
      function (finalResponse, callback) {

        async.eachSeries(finalResponse.dateArray, function (singleDate, next) {
          var day_start_of_date = moment().year(singleDate.year).startOf('year');
          var day_end_of_date = moment().year(singleDate.year).endOf('year');
          var momentObjFrom = new Date(moment(day_start_of_date));
          var momentObjTo = new Date(moment(day_end_of_date));
          var condition = {};
          condition.shortUrl = req.body.shortUrl;
          condition.$and = [{
            onClickDate: {
              $gte: momentObjFrom
            }
          },
          {
            onClickDate: {
              $lte: momentObjTo
            }
          }
          ];
          clickTracker.aggregate([{
            $match: condition
          }, {
            "$group": {
              "_id": "$shortUrl",
              "avgCount": {
                "$sum": {
                  "$ifNull": ["$clickCount", 0]
                }
              }
            }
          }], function (err, counts) {
            if (counts.length > 0) {
              countObj = {
                category: singleDate.year,
                count: counts[0].avgCount
              }
              finalResponse.dateFormatArray.push(countObj);
              next();
            } else {
              countObjIfNull = {
                category: singleDate.year,
                count: 0
              }
              finalResponse.dateFormatArray.push(countObjIfNull);
              next();
            }
          })
        }, function (err) {
          if (err) {
            callback(err, false);
          } else {
            callback(null, finalResponse);
          }
        })
      },
    ],
      function (err, data) {
        if (err) {
          res.json({
            code: 400,
            data: {},
            message: "INTERNAL_ERROR"
          });
        } else {
          res.json({
            code: 200,
            data: data,
            message: "DATA_FOUND_SUCCESSFULLY"
          });
        }
      });
  }


})


router.get('/', function (req, res) {
  clickTracker.find({}).sort({
    onClickDate: -1
  }).exec(function (err, urls) {
    var urls = underscore.uniq(urls, 'shortUrl');
    if (err) return next(err);
    res.json(urls);
  });
}),

  router.post('/', function (req, res) {
    var longUrl = req.body.url;
    var shortUrl = '';
    Url.findOne({
      long_url: longUrl
    }, function (err, doc) {
      if (doc) {
        shortUrl = config.webhost + base58.encode(doc._id);
        res.json({
          'shortUrl': shortUrl
        });
      } else {
        var newUrl = Url({
          long_url: longUrl
        });
        newUrl.save(function (err) {
          if (err) {
            console.log(err);
          }
          shortUrl = config.webhost + base58.encode(newUrl._id);

          res.json({
            'shortUrl': shortUrl
          });
        });
      }

    });

  });


router.get('/:encoded_id', function (req, res) {
  var base58Id = req.params.encoded_id;
  var id = base58.decode(base58Id);
  Url.findOne({
    _id: id
  }, function (err, doc) {
    if (doc) {
      clickTracker.findOne({
        longUrl: doc.long_url
      }, function (err, urlResult) {
        if (err) {
          res.redirect(config.webhostUrl);
        }
        else {
          var newClickTracker = new clickTracker();
          newClickTracker.onClickDate = Date.now(),
            newClickTracker.platform = req.useragent.browser,
            newClickTracker.userAgent = req.useragent,
            newClickTracker.longUrl = doc.long_url
          newClickTracker.shortUrl = config.webhost + base58.encode(id),
            newClickTracker.referer = req.headers.referer,
            newClickTracker.clickCount = 1
          newClickTracker.save(function (err, clickResult) {
            if (!err) {
              res.redirect(doc.long_url);
            } else {
              res.redirect(config.webhostUrl);
            }
          })
        }
      })
    } else {
      res.redirect(config.webhostUrl);
    }
  });

});

module.exports = router;

