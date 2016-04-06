angular.module('VinceLynch')
.controller('MainController', MainController);

MainController.$inject = ['$auth', 'tokenService', '$resource', '$window', '$state', 'GEOCODER_API_KEY', '$http', 'GUARDIAN_API_KEY'];
function MainController($auth, tokenService, $resource, $window, $state, GEOCODER_API_KEY, $http, GUARDIAN_API_KEY) {
  var self = this;


  self.loginDeets = {};
  self.currentUser = {};
  self.currentLocation = {};
  self.helloworld = "hello Angular";
  self.instagrams = [];
  self.searchPlace = {};
  self.wikitable = {};
  self.selected = {};
  self.summary = {};
  self.detailed = {};
  self.wikicity = {};
  self.country = {};
  self.guardianarticles = [];
  self.nomadResult = {};
  self.meetsRequirements = {};
  self.meetsRequirements.beer = [];
  self.meetsRequirements.coffee = [];
  self.meetsRequirements.response = [];
  self.requirements = {};
  self.requirements.beer = 7.90;
  self.requirements.rent = 900;
  self.requirements.coffee = 4.50;
  self.requirements.foreignerFriendyIdx = {
      value: 10,
      options: {
        showSelectionBar: true,
        getSelectionBarColor: function(value) {
          if (value <= 3)
            return 'red';
          if (value <= 6)
            return 'orange';
          if (value <= 9)
            return 'yellow';
          return '#2AE02A';
        }
      }
    };
  self.requirements.racismIdx = {
      value: 10,
      options: {
        showSelectionBar: true,
        getSelectionBarColor: function(value) {
          if (value <= 3)
            return 'red';
          if (value <= 6)
            return 'orange';
          if (value <= 9)
            return 'yellow';
          return '#2AE02A';
        }
      }
    };

  self.requirements.lgbtIdx  = {
      value: 10,
      options: {
        showSelectionBar: true,
        getSelectionBarColor: function(value) {
          if (value <= 3)
            return 'red';
          if (value <= 6)
            return 'orange';
          if (value <= 9)
            return 'yellow';
          return '#2AE02A';
        }
      }
    };
  self.requirements.rentMax = 1000;
  self.requirements.rentMin = 500;
  self.frontInstas = [];
  self.sortedBy = {};


/// Tell it what you want it to sort by and it sorts it
self.sortOrder= function(objectpropertytofind){

console.log("sortOrder function called with : " + objectpropertytofind);


var results = self.resultspage;


  self.sortedBy.airbnb = results.sort(function(a, b) {
    return parseFloat(a.cost.airbnb_median.USD) - parseFloat(b.cost.airbnb_median.USD);
  });
  
  self.sortedBy.beerincafe = results.sort(function(a, b) {
    return parseFloat(a.cost.beer_in_cafe.USD) - parseFloat(b.cost.beer_in_cafe.USD);
  });

  self.sortedBy.coffeeincafe = results.sort(function(a, b) {
    return parseFloat(a.cost.coffee_in_cafe.USD) - parseFloat(b.cost.coffee_in_cafe.USD);
    });

  self.sortedBy.coworkingspace = results.sort(function(a, b) {
  return parseFloat(a.cost.coworking.monthly.USD) - parseFloat(b.cost.coworking.monthly.USD);
});

  self.sortedBy.expat = results.sort(function(a, b) {
 return parseFloat(a.cost.expat.USD) - parseFloat(b.cost.expat.USD);
});

  self.sortedBy.hotel = results.sort(function(a, b) {
 return parseFloat(a.cost.hotel.USD) - parseFloat(b.cost.hotel.USD);
});

 self.sortedBy.local = results.sort(function(a, b) {
 return parseFloat(a.cost.local.USD) - parseFloat(b.cost.local.USD);
});

 self.sortedBy.longterm = results.sort(function(a, b) {
 return parseFloat(a.cost.longTerm.USD) - parseFloat(b.cost.longTerm.USD);
});

 self.sortedBy.lgbt = results.sort(function(a, b) {
 return parseFloat(a.scores.lgbt_friendly) - parseFloat(b.scores.lgbt_friendly);
});


 if (objectpropertytofind == "lgbt"){ // air bnb median
  self.resultspage = self.sortedBy.lgbt;
  console.log(self.sortedBy.lgbt)
 }

   if (objectpropertytofind == "airbnbmedia"){ // air bnb median
    self.resultspage = self.sortedBy.airbnb;
    console.log(self.sortedBy.airbnb)
   }

   if (objectpropertytofind == "beerincafe"){ // beer in cafe
    self.resultspage = self.sortedBy.beerincafe;
    console.log(self.sortedBy.beerincafe)
   };
     
   if (objectpropertytofind == "coffeeincafe"){ // coffee in cafe
    console.log("return sortBy Cofee_in_cafe")
    self.resultspage = self.sortedBy.coffeeincafe;
    console.log(self.sortedBy.coffeeincafe);
   };
   if (objectpropertytofind == "coworkingmonthly"){ // co working monthly rent
    self.resultspage = self.sortedBy.coworkingspace;
   };
   if (objectpropertytofind == "expat"){ // expat monthly spend 
    self.resultspage = self.sortedBy.expat;
   };
   if (objectpropertytofind == "hotel"){ // hotel per night
    self.resultspage = self.sortedBy.hotel;
   };
   if (objectpropertytofind == "local"){ // flat per month
    self.resultspage = self.sortedBy.local;
   };
   if (objectpropertytofind == "longterm"){  // long term monthly outgoings
    self.resultspage = self.sortedBy.longterm;
   };
   if (objectpropertytofind == "nonalcho"){ // can of cola in bar
    self.resultspage = self.sortedBy.cocacola;
   };

}

self.frontInstaBlocks = function(){
  console.log("frontInstaBlocks function called")
 var randomnumber = Math.floor(Math.random()*(sampleInstasBerlin.length - 33))
 var endofArray = randomnumber + 32;
 self.frontInstas = sampleInstasBerlin.slice(randomnumber,endofArray);
 console.log(self.frontInstas);
}

// if on RESULTS page, fetch last results
self.getLastResults = function(){
   if (self.resultspage == undefined){
    $state.transitionTo('front')
   }
}



/// if CITY page present, then load city
self.loadPage = function(){
var placePage = ($state.href($state.current.name, $state.params, {absolute: false})).split("/")[1];
  city = ($state.href($state.current.name, $state.params, {absolute: false})).split("/")[2];
  if (placePage == "place"){ // definitely a place page URL?
   // callfunctions for this URL
    this.getNomad(city)
    self.country = self.nomadResult.info.country.name;
    var country = self.country;
    self.selected = {city: city, country: country};
    self.getCityNumTableData(city,country)
    self.getWikicityData(city)
    self.getGeoCode();
  }
}

self.meetmyRequirements = function(){
  self.meetsRequirements.beer = []; // blank
  self.meetsRequirements.rent = []; // blank
  self.meetsRequirements.coffee = [];
  self.meetsRequirements.beer = []; // blank
  self.meetsRequirements.rent = []; // blank
  self.meetsRequirements.coffee = [];
  self.meetsRequirements.foreignerFriendyIdx = [];
  self.meetsRequirements.racismIdx = [];
  self.meetsRequirements.lgbtIdx = [];

  /////////// Return ID of location where LGBT Friendliness is GREATER than Requirements
    var lgbtIdx = (parseFloat(self.requirements.lgbtIdx.value));
      var i = 0;
      while (i < nomad.result.length){
        var lgbtIdxPercent = (nomad.result[i].scores.lgbt_friendly * 10);
        if (lgbtIdxPercent > lgbtIdx){
         console.log(nomad.result[i].info.city.name + " : " + lgbtIdxPercent + " is greater than" + lgbtIdx) 
        self.meetsRequirements.lgbtIdx.push(nomad.result[i].info.city.name);
        }
      i++
    }
   console.log(self.meetsRequirements.lgbtIdx);

  /////////// Return ID of location where Foreigner Friendliness is GREATER than Requirements
    var racismIdx = (parseFloat(self.requirements.racismIdx.value));
      var i = 0;
      while (i < nomad.result.length){
        var racismIdxPercent = (nomad.result[i].scores.racism * 10);
        if (racismIdxPercent > racismIdx){
        self.meetsRequirements.racismIdx.push(nomad.result[i].info.city.name);
        }
      i++
    }
    
/////////// Return ID of location where Racism Friendliness is GREATER than Requirements
  var foreignerFriendyIdx = (parseFloat(self.requirements.foreignerFriendyIdx.value));
    var i = 0;
    while (i < nomad.result.length){
      var cityFriendlyForeignerPercent = (nomad.result[i].scores.friendly_to_foreigners * 10);
      if (cityFriendlyForeignerPercent > foreignerFriendyIdx){
 self.meetsRequirements.foreignerFriendyIdx.push(nomad.result[i].info.city.name);
      }
    i++
  }
  console.log(self.meetsRequirements.foreignerFriendyIdx);

  
/////////// Return ID of location where Beers Less than Requirements
    var beer = parseFloat(self.requirements.beer);
    var i = 0;
    while (i < nomad.result.length){
      if (nomad.result[i].cost.beer_in_cafe.USD <= beer ){
        self.meetsRequirements.beer.push(nomad.result[i].info.city.name);
      }
    i++
  }
  //console.log(self.meetsRequirements.beer);

  ///////Return ID of location where RENT Less than Requirements


    var i = 0;
    while (i < nomad.result.length){
      if (nomad.result[i].cost.local.USD > self.requirements.rentMin && nomad.result[i].cost.local.USD < self.requirements.rentMax){
        self.meetsRequirements.rent.push(nomad.result[i].info.city.name);
      }
    i++
  }
  //console.log(self.meetsRequirements.rent);


  ///////Return ID of location where COFFEE Less than Requirements
    var coffee = parseFloat(self.requirements.coffee);
    var i = 0;
    while (i < nomad.result.length){
      if (nomad.result[i].cost.coffee_in_cafe.USD <= coffee ){
        self.meetsRequirements.coffee.push(nomad.result[i].info.city.name);
      }
    i++
  }
  //console.log(self.meetsRequirements.coffee);

  ////////////////////////////////////////////////
  rent = self.meetsRequirements.rent;
  beer = self.meetsRequirements.beer;
  coffee = self.meetsRequirements.coffee;
  foreignerfriendly = self.meetsRequirements.foreignerFriendyIdx
  racismIdx = self.meetsRequirements.racismIdx
  lgbtIdx = self.meetsRequirements.lgbtIdx



/////// THE LIST OF CITIES THAT MEETS REQUIREMENTS
  self.meetsRequirements.response = _.intersection(rent, coffee, beer, foreignerfriendly, racismIdx, lgbtIdx);
///////////////////////
  var newArr = [];
  var i = 0;
  while (i < self.meetsRequirements.response.length){
    var r = 0;
    while (r < nomad.result.length){
        if (nomad.result[r].info.city.name == self.meetsRequirements.response[i]){
         newArr.push(nomad.result[r]);
        }
      r++
    }
   i++
  }
  
  self.resultspage = newArr;
  console.log(self.resultspage); // display these on results page
 $state.transitionTo('results'); //transition to results page
 // result values
 self.requirements.foreignerFriendyIdx.value = 10;
 self.requirements.lgbtIdx.value = 10;
 self.requirements.racismIdx.value = 10;
}

var Guardian = $resource('http://content.guardianapis.com/search?q=millennials%2C%20cities&api-key=' + GUARDIAN_API_KEY, {}, {
});

this.getGuardianArticles= function(){
  Guardian.get(function(data){
    console.log('success, got Guardian Articles: ', data);  
   self.guardianarticles = data.response.results;
   console.log(self.guardianarticles);
    }, function(err){
    console.log('Guardian Articles API - request failed');
    });
}
this.getGuardianArticles();


var Geocoder = $resource('https://maps.googleapis.com/maps/api/geocode/json?address=' + self.selected.city + "+" + self.selected.country +  '&key=' + GEOCODER_API_KEY, {}, {
});


this.getGeoCode = function(){
  $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + self.selected.city + "+" + self.selected.country +  '&key=' + GEOCODER_API_KEY).success(function(data){
    console.log(data.results[0].geometry.location);
    self.selected.lat = data.results[0].geometry.location.lat;
    self.selected.lng = data.results[0].geometry.location.lng;
    self.InstaLocationGet(self.selected.lat,self.selected.lng)
  });
}


var Wikicity = $resource('http://localhost:8000/api/wikicity/:city', {}, {
  get: { cache: true, method: 'get' }
});

this.getWikicityData = function(city){
    Wikicity.get({city: city},function(data){
      console.log('success, got Wikicity: ', data);  
      self.wikicity = data;
      }, function(err){
      console.log('Wikicity Internal API - request failed');
      });
  }

this.getLatLngRESTcountries = function(city){
  $http.get('https://restcountries.eu/rest/v1/capital/' + city).success(function(data){
    console.log(data);
  });
}

var Numtable = $resource('http://localhost:8000/api/numtable/:city/:country', {}, {
  get: { cache: true, method: 'get' }
});

this.getCityNumTableData = function(city, country){
  Numtable.get({city: city, country: country},function(data){
    console.log('success, got Numdata: ', data);  
    self.summary = data.summary;
    self.detailed = data.details;
    }, function(err){
    console.log('Numdata Internal API - request failed');
    });
}


this.gotoCity2 = function(city){  //lodash
  this.getNomad(city)
  self.country = self.nomadResult.info.country.name;
  var country = self.country;

  $state.transitionTo('city', {city: city, country: country});
}




this.gotoCity = function(country){  //lodash
  self.country = $window._.find(Cities, { name: country });

  var city = self.country.capital;
  self.getNomad(city)

  console.log(self.country)
  console.log("city is: " + city);

  self.selected = {city: city, country: country};
  self.getCityNumTableData(city,country)
  self.getWikicityData(city)
  self.getGeoCode();

  $state.transitionTo('city', {city: city, country: country});
}

this.getNomad = function(city){
  console.log("get nomad function called");
  city = city.charAt(0).toUpperCase() + city.substr(1).toLowerCase();
  var i = 0;
  while (i < nomad.result.length){
    if (nomad.result[i].info.city.name == city){
      console.log(i);
      break;
    }
  i++
  }
 self.nomadResult = nomad.result[i]
 console.log(self.nomadResult)
}

  var Wikitable = $resource('http://localhost:8000/api/wikitable/:wikipage', {}, {
    get: { cache: true, method: 'get' }
  });



  

this.getWikiTable = function(wikititle){
  Wikitable.get({wikipage: wikititle},function(data){
    data.rows.shift();
    console.log('success, got wikitable: ', data.rows);  
    self.wikitable = data.rows; 
/*
        google.charts.load('current', { 'packages': ['map'] });
        google.charts.setOnLoadCallback(drawMap);

        function drawMap() {
          var data = google.visualization.arrayToDataTable([
            ['Country', 'Index'],
            ['China', 'China: 1,363,800,000'],
            ['India', 'India: 1,242,620,000'],
            ['US', 'US: 317,842,000'],
            ['Indonesia', 'Indonesia: 247,424,598'],
            ['Brazil', 'Brazil: 201,032,714'],
            ['Pakistan', 'Pakistan: 186,134,000'],
            ['Nigeria', 'Nigeria: 173,615,000'],
            ['Bangladesh', 'Bangladesh: 152,518,015'],
            ['Russia', 'Russia: 146,019,512'],
            ['Japan', 'Japan: 127,120,000']
          ]);
   

        var options = { showTip: true };

        var map = new google.visualization.Map(document.getElementById('chart_div'));

        map.draw(data, options);
      };
      */


    var lat = data.rows.wikisummary  
    // self.InstaLocationGet(lat, lng) 
    }, function(err){
    console.log('WikiTable Internal API - request failed');
    });
  }
  
  


  var Instagram = $resource('http://localhost:8000/api/instagram/:lat/:lng', {}, {
    get: { cache: true, method: 'get' }
  });

  this.createGifFromInstas = function(){
    gifshot.createGIF({
      'images': self.instagrams,
      'text': self.selected.city,
      'gifWidth': 400,
      'gifHeight': 300,
      'fontSize': '30px',
      'interval': 0.25,
      'resizeFont': true,
      'textBaseline': 'bottom',
       //['http://i.imgur.com/2OO33vX.jpg', 'http://i.imgur.com/qOwVaSN.png', 'http://i.imgur.com/Vo5mFZJ.gif']
    },function(obj) {
      if(!obj.error) {
        var image = obj.image,
        animatedImage = document.createElement('img');
        animatedImage.src = image;
        document.getElementById("instaGIF").appendChild(animatedImage);
        //document.body.appendChild(animatedImage);
      }
    });
  }

  this.InstaLocationGet = function(lat, lng) {
    self.instagrams = Instagram.get({lat: lat, lng: lng}, function(data){
    self.instagrams = data.images.images;  
    self.instagrams.pop();
    console.log(self.instagrams); 
    self.createGifFromInstas() // create Gifs for City
    }, function(err){
    console.log('API Instagram Location - request failed');
    });
  }

  this.showlocation = function() {
     // One-shot position request.
     navigator.geolocation.getCurrentPosition(self.callback);
  }
   
  this.callback = function(position) {
     self.currentLocation.lat = position.coords.latitude;
     self.currentLocation.lng = position.coords.longitude;
     //self.InstaLocationGet(self.currentLocation.lat, self.currentLocation.lng)
  }


  this.login = function(){
    console.log("Submitted login with" + self.loginDeets.email + "password: " + self.loginDeets.password )
    $auth.login(self.loginDeets)
  }

  this.register = function(){
    console.log("Submitted register with" + self.loginDeets.email + "password: " + self.loginDeets.password )
    $auth.signup(self.currentUser)
  }

  this.isLoggedIn = function() {
    return !!tokenService.getToken();
  }

  this.currentUser = tokenService.getUser();

  this.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function() {
        self.currentUser = tokenService.getUser();
      });
  }

  this.logout = function() {
    tokenService.removeToken();
    this.currentUser = null;
  }

}
