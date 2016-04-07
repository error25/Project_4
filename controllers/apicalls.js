var request = require('request');
var cheerio = require('cheerio');
var phantomjs = require('phantomjs');
var phantom = require('node-phantom');
var driver = require('node-phantom-simple');
var tabletojson = require('tabletojson');




function numtable(req,res){

  var city = req.params.city
  var country = req.params.country
 // country = "portugal";
 // city = "city";

  var url = "http://www.numbeo.com/cost-of-living/city_result.jsp?country=" + country + "&city=" + city + "";

  tabletojson.convertUrl(url)
  .then(function(tablesAsJson) {
    var headers = tablesAsJson[0];
    var rows = tablesAsJson[1];
    var summary = tablesAsJson[2];
    var details = tablesAsJson[3];

    return res.status(200).json({summary: summary, details: details});
  });

}



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






   module.exports = {
     instagramR: instagramR,
     numtable: numtable
   };