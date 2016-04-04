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



function numCity(req, res){

  var city = req.params.city
  var country = req.params.country

  url = "http://www.numbeo.com/cost-of-living/city_result.jsp?country=" + country + "&city=" + city + "";

       //url = "http://www.numbeo.com/cost-of-living/city_result.jsp?country=United+Kingdom&city=Brighton"; // URL to scrape
     request(url, function (error, response, body) {
      console.log(body)
       if (!error) {
         var $ = cheerio.load(body),
           fetched_data = $('td').html(); // test that you can scrape a single jquery element selector
         console.log("The data retrieved says:" + fetched_data + "," ); // 

         tdArr = [];

       $('td').each(function( index ) {
           console.log( index + ": " + $(this).text() ); //
           tdArr.push($(this).text());
       });

       return res.status(200).json({data: tdArr });

       } else {
         console.log("We’ve encountered an error: " + error);
       }
     });
     // End of scraping functionality.


   }


   module.exports = {
     instagramR: instagramR,
     numCity: numCity
   };