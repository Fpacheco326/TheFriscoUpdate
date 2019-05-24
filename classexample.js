var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var mongojs = require("mongojs");
var app = express();
var nightmare =


console.log("\n***********************************\n" +
    "Grabbing every thread name and link\n" +
    "from SFExaminer:" +
    "\n***********************************\n");
    