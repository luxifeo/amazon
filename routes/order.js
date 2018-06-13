var mongoose = require('mongoose');
var OrderSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  items: String,
  total: Number,
  date: Date
});
var Order = mongoose.model('Buy',OrderSchema);
module.exports = Order;
