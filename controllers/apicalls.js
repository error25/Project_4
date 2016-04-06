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
var tabletojson = require('tabletojson');
var Wiki = require('wikijs');




function wikicity(req,res){
  city = req.params.city;
  var wiki = new Wiki();
  wiki.page(city).then(function(page) {
    page.info().then(function(info) {
      console.log(info); // Bruce Wayne 
      return res.status(200).json({wikisummary: info});
    });
  });
   
/*  var url = "https://en.wikipedia.org/wiki/Oslo";
  tabletojson.convertUrl(url)
  .then(function(tablesAsJson) {
    var summary = tablesAsJson[0];
    return res.status(200).json({summary: summary});
  });*/
}

function numtable(req,res){

  var city = req.params.city
  var country = req.params.country
 // country = "portugal";
 // city = "city";

  var url = "http://www.numbeo.com/cost-of-living/city_result.jsp?country=" + country + "&city=" + city + "";
  //var url = "http://www.numbeo.com/cost-of-living/city_result.jsp?country=Portugal&city=Lisbon";
  tabletojson.convertUrl(url)
  .then(function(tablesAsJson) {
    var headers = tablesAsJson[0];
    var rows = tablesAsJson[1];
    var summary = tablesAsJson[2];
    var details = tablesAsJson[3];

    return res.status(200).json({summary: summary, details: details});
  });

}


function wikitable(req,res){

  wikipage = req.params.wikipage;

  var url = 'https://en.wikipedia.org/wiki/' + wikipage;
  tabletojson.convertUrl(url)
  .then(function(tablesAsJson) {
    var headers = tablesAsJson[0];
    var rows = tablesAsJson[1];

    return res.status(200).json({headers: headers, rows: rows});
  });

}

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

          setTimeout(function () {
            return page.evaluate(function () {

              var ImagesArr = [],
                  pArr = [];

   
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

loadedPage = [];

function instaTest(req,res){

  driver.create({ path: require('phantomjs').path }, function (err, browser) {
    return browser.createPage(function (err, page) {
      loadedPage = page;
      
      return page.open("http://ramblr.us/?q=Barcelona,%20Spain", function (err,status) {
     console.log("opened site? ", status);
        page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function (err) {
              setTimeout(function () {
                return page.evaluate(function () {

                  var imgArr = [],
                      pArr = [];
                  $('img').each(function () { imgArr.push($(this).attr('src')); });
                  $('p').each(function () { pArr.push($(this).html()); });
                  $(window).scrollTop(4000);
                  return {
                    img: h2Arr
                  };
                }, function (err,result) {
                  console.log(result);
                });
              }, 900);
      });
   setTimeout(function(){ 




    page.render('capture3.png') 

  },2000) 
       
    });
  });
    browser.exit(); 
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
     numCity: numCity,
     wikitable: wikitable,
     numtable: numtable,
     wikicity: wikicity,
     instaTest: instaTest
   };