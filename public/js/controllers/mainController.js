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
 // http://content.guardianapis.com/search?q=millennials%2C%20cities&api-key=



self.convertCurrencytoUSD = function(){
  console.log(self.detailed);
  var i = 0;
  while (i < self.detailed.length){
   var firstVal = (self.detailed[i][2]).split('-', 1)[0];
   var secondVal = (self.detailed[i][2]).split('-', 2)[1];
   firstVal = parseFloat(firstVal);
   secondVal = parseFloat(secondVal);

   console.log(firstVal);
   console.log(secondVal);
   self.detailed[i][2] = parseFloat((firstVal + secondVal) / 2);
   self.detailed[i][2] = (parseFloat(self.nomadResult.cost.exchange_rate.USD) * (self.detailed[i][2])); // to dollars
    i++
  }
  console.log(self.detailed[1][2])
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

  self.meetsRequirements.response = _.intersection(rent, coffee, beer, foreignerfriendly, racismIdx, lgbtIdx);
  console.log(self.meetsRequirements.response);
 
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

  console.log("city is: " + city);
  console.log("country is: " + country);

  self.selected = {city: city, country: country};
  self.getCityNumTableData(city,country)
  self.getWikicityData(city)
  self.getGeoCode();

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
        document.getElementById("instaGIF").appendChild(animatedImage)
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
