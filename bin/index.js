#!/usr/bin/env node

// 引入包的核心逻辑
const { scanFunc, packFunc, translateFunc } = require('../index.js');
const args = process.argv.slice(2);

if (args.includes('-s')) {
    scanFunc();
} else if (args.includes('-p')) {
    packFunc();
} else if (args.includes('-t')) {
    translateFunc();
} else {
    console.log('Invalid command. Please use -s, -p or -t.');
}