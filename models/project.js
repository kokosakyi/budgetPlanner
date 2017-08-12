/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

// Validate Function to check blog title length
let titleLengthChecker = (title) => {
  // Check if blog title exists
  if (!title) {
    return false; // Return error
  } else {
    // Check the length of title
    if (title.length < 5 || title.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid title
    }
  }
};

// Validate Function to check blog title length
let listItemLengthChecker = (title) => {
  // Check if blog title exists
  if (!title) {
    return false; // Return error
  } else {
    // Check the length of title
    if (title.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid title
    }
  }
};


// Validate Function to check if valid title format
let alphaNumericTitleChecker = (title) => {
  // Check if title exists
  if (!title) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid title
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    return regExp.test(title); // Return regular expression test results (true or false)
  }
};

// Array of Title Validators
const titleValidators = [
  // First Title Validator
  {
    validator: titleLengthChecker,
    message: 'Title must be more than 5 characters but no more than 50'
  },
  // Second Title Validator
  {
    validator: alphaNumericTitleChecker,
    message: 'Title must be alphanumeric'
  }
];

// Array of Title Validators
const listItemValidator = [
  // First list items Validator
  {
    validator: listItemLengthChecker,
    message: 'Item name must be no more than 50'
  },
  // Second Title Validator
  {
    validator: alphaNumericTitleChecker,
    message: 'Item name must be alphanumeric'
  }
];


// Blog Model Definition
const projectSchema = new Schema({
  title: { type: String, required: true, validate: titleValidators },
  totalSavings: { type: Number, required: true, default: 0 },
  monthlySavings: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  targetDuration: { type: Number, default: 0 },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now() },
  items: [{
    listItem: { type: String, validate: listItemValidator },
    cost: { type: Number }
  }]
});

// Export Module/Schema
module.exports = mongoose.model('Project', projectSchema);
