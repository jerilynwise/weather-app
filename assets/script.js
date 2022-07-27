// Set global variables, including Open Weather Maps API Key
var keyAPI = "75c11b98c1e96b59417961288d3f315d";
var BASE_URL = "https://api.openweathermap.org"
var currentCity = "";
var pastCities = [];
var searchForm = document.getElementById("searchForm")
var searchCity = document.getElementById("searchCity");
var current = document.getElementById("current");
var forecast = document.getElementById("forecast");
var cityListEl = document.getElementById("savedCities")

// load cities from local storage
function loadCities() {
    const storedCities = JSON.parse(localStorage.getItem('pastCities'));
    if(storedCities) {
        pastCities = storedCities;
        displayCities()
    }
}

function searchSubmit(e){
    // Don't continue if there is nothing in the search form
  if (!searchCity.value) {
    return;
  }

  e.preventDefault();
  var city = searchCity.value.trim();
  getCoors(city);
  searchCity.value = '';

}

loadCities();

     // Function to display the searched cities with the most recent on top
     function displayCities() {
        cityListEl.innerHTML = '';
        for(let i = pastCities.length -1; i >= 0; i--) {
            var searchBtn = document.createElement('button');
            searchBtn.setAttribute('data-search', pastCities[i]);
            searchBtn.setAttribute('aria-controls', "todays forcast");
            searchBtn.classList.add("history-btn");
            searchBtn.textContent = pastCities[i];
            cityListEl.append(searchBtn);
        }
    }
    //FUNC TO PUSH CITIES TO SAVED STORAGE
    function appendToSearchHistory(city) {
        if(pastCities.indexOf(city) !== -1) {
            return
        }
        pastCities.push(city);
        localStorage.setItem("pastCities", JSON.stringify(pastCities));
        displayCities();
    };
    //FUNC TO PULL WEATHER INFO IF IT IS CLICKED FROM SAVED BUTTONS
    function searchHistoryClick(event) {
        if (!event.target.matches(".history-btn")) {
          return;
        }
        var btn = event.target;
        var city = btn.getAttribute("data-search");
        getCoors(city);
      }

// CALL TO GET THE COORDINATES
function getCoors(city) {

    var API_URL =
      BASE_URL + "/geo/1.0/direct?q=" + city + "&limit=5&appid=" + keyAPI;
    fetch(API_URL)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert("Location Not Found");
        } else {
          getWeather(data[0]);
        }
      });
  }

function getWeather(data) {
    var lat = data.lat
    var lon = data.lon
    var city = data.name
    var API_URL = BASE_URL + "/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=" + keyAPI
    fetch(API_URL).then(function(res){
        return res.json()
    })
    .then(function(data){
        console.log(data);
        appendToSearchHistory(city);
        renderCurrent(city,data);
        renderForecast(data.daily);
    })
}

// renderCurrent 
function renderCurrent(city, data) {
    var header = document.createElement('h3');
    var iconEl = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uvEl = document.createElement('button');
    var iconUrl = `https://openweathermap.org/img/w/${data.current.weather[0].icon}.png`;
    var iconDescription = data.current.weather[0].description || weather[0].main;
    iconEl.setAttribute('src', iconUrl);
    iconEl.setAttribute('alt', iconDescription);

    var date = data.current.dt;
    var convertedDate = dayjs.unix(date).format("M/D/YYYY");
    current.innerHTML = '';


    header.innerHTML = `
    ${city} ${convertedDate} 
    `
    header.append(iconEl);

    tempEl.innerHTML = `
    Temperature: ${data.current.temp} F
    `
    windEl.innerHTML = `
    Wind Speed: ${data.current.wind_speed} mph
    `
    humidityEl.innerHTML = `
    Humidity: ${data.current.humidity} %
    `
    uvEl.textContent = data.current.uvi

    current.append(header,tempEl,windEl,humidityEl,uvEl)
};

//PUT THE CURRENT DAYS FORECAST ON THE SCREEN
function renderForecast(data) {
    console.log(data)
    var startDt = dayjs().add(1, 'day').startOf('day').unix();
    var endDt = dayjs().add(6, 'day').startOf('day').unix();
    forecast.innerHTML = '';
    for(var i = 0; i < data.length; i++) {
        if(data[i].dt >= startDt && data[i].dt < endDt) {
            renderDailyForcast(data[i])
        }
    }

}


//PUTS THE NEXT 5 DAYS ON THE SCREEN
function renderDailyForcast(data) {
    var date = data.dt;
    var col = document.createElement('div');
    var card = document.createElement('div');
    var header = document.createElement('h3');
    var iconEl = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var cardBody = document.createElement("div");
    var convertedDate = dayjs.unix(date).format("M/D/YYYY");
    var iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    var iconDescription = data.weather[0].description || weather[0].main;
    iconEl.setAttribute('src', iconUrl);
    iconEl.setAttribute('alt', iconDescription);
    col.append(card);
    card.append(cardBody);
    cardBody.append(header,tempEl,windEl,humidityEl);
    col.setAttribute('class', 'col-md');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    header.setAttribute('class', 'card-title');
    
    

    header.innerHTML = `
    ${convertedDate} 
    `
    header.append(iconEl);

    tempEl.innerHTML = `
    Temperature: ${data.temp.day} F
    `
    windEl.innerHTML = `
    Wind Speed: ${data.wind_speed} mph
    `
    humidityEl.innerHTML = `
    Humidity: ${data.humidity} %
    `

    
    forecast.appendChild(cardBody);
}


searchForm.addEventListener("submit", getCoors)
cityListEl.addEventListener("click", searchHistoryClick);

