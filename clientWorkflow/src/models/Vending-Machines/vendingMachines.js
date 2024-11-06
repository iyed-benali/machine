// models/VendingMachine.js
const { required } = require('joi');
const mongoose = require('mongoose');

const vendingMachineSchema = new mongoose.Schema({
  location: {
    type: String, 
    required: true,
  },
  blocked : {
    type: Boolean,
    required : true,
    default : false
  },
  open: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    default: [],
  },
  position: {
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  subCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('VendingMachine', vendingMachineSchema);
