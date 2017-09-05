let mongoose = require('mongoose');

//allowing the use of promise for call back
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoAppTest');

module.exports = {
mongoose
};