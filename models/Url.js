const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const urlSchema = new Schema ({
  url: {type: String, required: true, trim: true, unique: true},
  sid: {type: String}
});

module.exports = mongoose.model('Url', urlSchema);