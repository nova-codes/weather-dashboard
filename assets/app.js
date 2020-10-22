// global variables
let cityName;
let stateCode;
let searchHistory = [];

// current date in the weather card
$('.date').text(moment().format('ddd' + ', ' + 'LL'));

// run these first


// event listener for submit button
$('#search-city').click(function(event) {
    event.preventDefault();
    cityName = $('#search-input').val().trim();

    if(cityName === '') {
        $('.alert').css('opacity', '1'); 
    }
    else if(searchHistory.length >= 5) {
        searchHistory.shift();
        searchHistory.push(cityName);
        saveSearch();
        showWeather();
        showButtons();
    }
    else {
        searchHistory.push(cityName);
        saveSearch();
        showWeather();
        showButtons(); 
    }
});

// if user presses enter, that's ok too
$('#search-city').keypress(function(e) {
    if(e.which == 13) {
        $('#search-city').click();
    }
});

// list of previously searched cities, show weather for city clicked
$('.tophistory').click(function() {
    cityName = $(this).attr('data-name');
    showWeather();
    console.log(cityName);
});

// show previously searched cities in a list
function listCities() {
    $('.tophistory').empty();
    $('#search-input').val('');
    for(var i = 0; i < searchHistory.length; i++) {
        var cityButton = $('<a>');
        cityButton.addClass('pill');
        cityButton.attr('data-name', searchHistory[i]);
        cityButton.text(searchHistory[i]);
        $('.tophistory').append(cityButton); 
    }
}

// take last five searched cities from local storage
// then put them in the buttons
function showButtons() {
    var cityStorage = JSON.parse(localStorage.getItem('searchHistory'));

    if(cityStorage !== null) {
        searchHistory = cityStorage;
    }
    listCities();
}

// toss the cities into local storage so they can persist
function saveSearch() {
    localStorage.setItem('currentCity', JSON.stringify(cityName + ', ' + stateCode));
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// show the last searched city when page is loaded or reloaded
function previousCity() {
    var weatherStorage = localStorage.getItem('currentCity');
    if(weatherStorage !== null) {
        cityName = JSON.parse(weatherStorage);
        showWeather();
    }
}

// main function for displaying the weather

async function showWeather() {
    // openweathermap api call
    var openWeatherMap = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + ', '+ stateCode + "&units=imperial&appid=0db11239e44307838ff3571b683ebdc1";

    await $.ajax({
        url: openWeatherMap,
        method: 'GET'
    }).then(function(response) {
        console.log(response);

        $('.city-name').text(response.city.name); 

        // pull data for today's weather
        // icon
        var prefix = 'wi wi-owm-';
        var code = response.list[0].weather[0].id;
        var tag = $('<i>');
        var icon = tag.addClass(prefix + code + ' big-bg');

        $('.weather-icon').html(icon); 
        
        // other weather data
        $('#current-weather').text(response.list[0].weather[0].main); 
        $('.degree').text(response.list[0].main.temp);
        $('.humidity').text(response.list[0].main.humidity);
        $('.wind-speed').text(response.list[0].wind.speed); 

        // uv index
        var latitude = response.city.coord.lat;
        var longitude = response.city.coord.lon;
        var uvurl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=0db11239e44307838ff3571b683ebdc1";

        $.ajax({
            url: uvurl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            $("#uv-text").text("UV Index: ")
            $("#current-uv").text(response.value);
            $("#current-uv").removeClass("uv-low uv-moderate uv-high uv-vhigh uv-extreme");
            if (response.value <= 2.99) {
                $("#current-uv").addClass("uv-low");
            } else if (response.value >= 3 && response.value <= 5.99) {
                $("#current-uv").addClass("uv-moderate");
            } else if (response.value >= 6 && response.value <= 7.99) {
                $("#current-uv").addClass("uv-high");
            } else if (response.value >= 8 && response.value <= 10) {
                $("#current-uv").addClass("uv-vhigh");
            } else {
                $("#current-uv").addClass("uv-extreme");
            }
        })
    })
}