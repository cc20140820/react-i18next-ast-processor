require('dotenv').config();
const scanFunc = require('./scan.js');
const packFunc = require('./pack.js');
const translateFunc = require('./translate.js');

module.exports = {
    scanFunc,
    packFunc,
    translateFunc
};