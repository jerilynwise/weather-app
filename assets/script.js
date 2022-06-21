// Set global variables, including Open Weather Maps API Key
var keyAPI = "75c11b98c1e96b59417961288d3f315d";
var BASE_URL = "https://api.openweathermap.org"
var currentCity = "";
var lastCity = [];
var searchForm = document.getElementById("searchForm")
var searchCity = document.getElementById("searchCity");
var current = document.getElementById("current");


// CALL TO GET THE COORDINATES
function getCoors(e) {
    e.preventDefault()
    var city = searchCity.value
    var API_URL = BASE_URL + "/geo/1.0/direct?q=" + city + "&limit=5&appid=" + keyAPI
    fetch(API_URL).then(function(res){
        return res.json()
    })
    .then(function(data){
        if (!data[0]) {
            alert("Location Not Found")
        }
        else{
            // console.log(data)
            // function to take care of local storage
            // addToHistory()
            getWeather(data[0])
        }
    })
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
        console.log(data)
        renderCurrent(city,data)
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


    header.innerHTML = `
    ${city} 
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

}






searchForm.addEventListener("submit", getCoors)