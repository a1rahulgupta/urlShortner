
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClickTrackerSchema = Schema({
    UserId:     { type : mongoose.Schema.Types.ObjectId },
    onClickDate:{type : Date, default: Date.now},
    platform:   { type: String},
    longUrl:    {type: String},
    shortUrl:   { type: String},
    referer:    { type: String},
    userAgent: {},
    clickCount: { type: Number,default: 0}
});

var clickTracker = mongoose.model('clickTracker', ClickTrackerSchema);

// create a schema for our links
module.exports = clickTracker;
