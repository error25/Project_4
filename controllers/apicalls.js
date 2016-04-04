var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var jsdom = require("jsdom");
//var phantom = require('phantom');
var scraperjs = require('scraperjs');
var phantomjs = require('phantomjs');
var Revenant = require('revenant');

var phantom = require('node-phantom');
var driver = require('node-phantom-simple');


//http://ramblr.us/?q=Barcelona,%20Spain (HMMM doesnt work, )


// http://www.gramfeed.com/instagram/map#/36.1699,-115.1398/1000/-


function instagramR(req,res){

  var lat = req.params.lat
  var lng = req.params.lng

  driver.create({ path: require('phantomjs').path }, function (err, browser) {
    return browser.createPage(function (err, page) {
      return page.open("http://www.gramfeed.com/instagram/map#/" + lat + "," + lng + "/5000/-", function (err,status) {
        console.log("opened site? ", status);
        page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function (err) {
          // jQuery Loaded. 
          // Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds. 
          setTimeout(function () {
            return page.evaluate(function () {
              //Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object. 
              var ImagesArr = [],
                  pArr = [];

/*              $('html, body').animate({scrollTop:10000},'10', function() {
                console.log( "scroll down by 10,000 pixels apparently succeeded" );

                $('img').each(function () { 
                  h2Arr.push($(this).attr('src')); 
                });

              });;*/
   
              $('.photo-grid').each(function () { 
               ImagesArr.push($(this).attr('src')); 
              });
            // $('p').each(function () { pArr.push($(this).html()); });
   
              return {
                images: ImagesArr,
                p: pArr
              };
            }, function (err,result) {
              console.log(result.images.length);
              return res.status(200).json({images: result });
              browser.exit();
            });
          }, 900);
        });
      });
    });
  });
}

/*// example AJAX test page 
const URL = 'http://jiahaog.github.io/ajax-test-page/';
 
// selector for AJAX content 
const SELECTOR = '#setTimeoutContent';
 
// create a browser 
var browser = new Revenant();
 
browser
    .openPage(URL)
    .then(function () {
      console.log("reached attempt to open page")
        return browser.waitForElement(SELECTOR);
    })
    .then(function () {
        return browser.getInnerHTML(SELECTOR);
    })
    .then(function (result) {
        console.log(result); // 'BUBBLES' 
 
        // kills the PhantomJS process 
        browser.done();
 
    }).catch(function (error) {
      console.log(error);
        browser.done();
    });*/


/*
function instagramCity(req, res){
     var urltoScrape = req.params.id;

     // write file to store SCRAPED data in a comma seperated list.
   //  fs.writeFile('scraped.txt', 'Hello World!', function (err) {
     //  if (err) return console.log(err);
   //    console.log('Hello World > scraped.txt');
 //    });
       url = "http://www.gramfeed.com/instagram/map#/36.1699,-115.1398/1000/-"; // URL to scrape
     request(url, function (error, response, body) {
      console.log(body)
       if (!error) {
         var $ = cheerio.load(body),
           fetched_data = $('img').attr('src'); // test that you can scrape a single jquery element selector
         console.log("The data retrieved says:" + fetched_data + "," ); // 


     $( "img" ).each(function( index ) {
         console.log( index + ": " + $(this).attr('src') ); // dont console log
           fs.appendFile('scraped.txt', $(this).attr('src') + "," , function (err) {
           });
     });
       } else {
         console.log("We’ve encountered an error: " + error);
       }
     });
     // End of scraping functionality.

     setTimeout(function(){ //wait 8 seconds until we check the file for the data to be stored

       fs.readFile("scraped.txt", "utf8", function (error, data) {
               console.log("The current data file (stored on server) contains:" + data);
               var html = 'You scraped: ' + urltoScrape + '.<br>' +
                          '<a href="/">Try again.</a><br><br><p></p>' + data;
               res.send(html);
           }); // only shows webpage after 8 seconds
     },8000)

   }*/


   module.exports = {
     instagramR: instagramR
   };