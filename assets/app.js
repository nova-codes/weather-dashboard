// global variables
let cityName;
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
        $('.tophistory').prepend(cityButton); 
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
    localStorage.setItem('currentCity', JSON.stringify(cityName));
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
    var openWeatherMap = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=0db11239e44307838ff3571b683ebdc1";

    await $.ajax({
        url: openWeatherMap,
        method: 'GET'
    }).then(function(response) {
        console.log(response);

        $('.city-name').text(response.name); 

        // pull data for today's weather
        // icon
        var prefix = 'wi wi-owm-';
        var code = response.weather[0].id;
        var tag = $('<i>');
        var icon = tag.addClass(prefix + code + ' big-bg');

        $('.weather-icon').html(icon); 
    })
}