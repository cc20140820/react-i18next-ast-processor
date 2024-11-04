require('dotenv').config();
const scanFunc = require('./scan.js');
const packFunc = require('./pack.js').default;
const translateFunc = require('./translate.js');

module.exports = {
    scanFunc,
    packFunc,
    translateFunc
};