var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var mongojs = require("mongojs");
var app = express();
var Nightmare = require("nightmare");
var bodyParser = require('body-parser');
var exhbs = require("express-handlebars");

// var PORT = process.env.PORT || 3000;

// var routes = require("./routes");

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exhbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");
console.log("\n***********************************\n" +
    "Grabbing every thread name and link\n" +
    "from SFExaminer:" +
    "\n***********************************\n");


var databaseUrl = process.env.MONGODB_URI || "scraper_db";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);

// app.use(bodyParser());


db.on("error", function(error) {
    console.log("Database Error:", error);
});

app.get("/scrapedData", function(req, res){

    db.scraper_db.find({}, function(error, scr){

        res.json(scr);
    });
});

app.post("/scrapedData", function(req, res){

    db.scraper_db.insert({name: req.body.name, article: req.body.article}, function(error, savedDoc){
        if(error){
            console.log(error);
        }else{
            res.json(savedDoc);
        }
    });
});

// function scrape(url){
//     console.log(url);
//     var scrape = new Nightmare({
//         show: true
//     })
//     .goto(url)
//     .evaluate(function(){
//         return document.body.innerHTML;
//     }).end().then(function(html){
//         if (html == undefined) {
//             console.log('==================');
//             console.log('html not there!');
//             console.log(arg);
//             console.log('==================');
//             return;
//         }

//         var $ = cheerio.load(html);
//     })
// };

// var url = 'https://www.sfexaminer.com/';

// function friscoScraper(){
// 	var doIt = new Nightmare({
// 	          show: true
//           }).goto(url).type('input[title="Search"]', 'github nightmare').click('.searchsubmit')
//           .wait('#links .result__a')
//       .evaluate(() => document.querySelector('#links .result__a').href)
//     //   .end()
//       .then(console.log)
//   .catch(error => {
//     console.error('Search failed:', error)
//   });
// }

// friscoScraper();


var scrape = function(){

return axios.get("https://www.sfgate.com/bayarea/").then(function (response,res) {


    var $ = cheerio.load(response.data);


    var results = [];


    $("p.title").each(function (i, element) {


        var title = $(element).text();

        var link = $(element).children().attr("href");


        results.push({
            title: title,
            link: link
        });
        res.send("Scrape Complete");
    });
scrape(url);
    db.on("error", function (error) {
        console.log("Database Error:", error);
    });
    
    
    app.get("/", function (req, res) {
        res.send(cheerio);
    });
    
    app.get("/all", function (req, res) {
     
        db.scrapedData.find({}, function (error, found) {
    
            if (error) {
                console.log(error);
            }
    
            else {
                res.json(found);
            }
        });
    });
    


    console.log(results);
   
});
}

app.listen(3000, function () {
    console.log("App running on port 3000!");
});

