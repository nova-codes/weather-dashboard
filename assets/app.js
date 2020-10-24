// global variables
let cityName;
let stateCode;
let searchHistory = [];

// current date in the weather card
$('.date').text(moment().format('ddd' + ', ' + 'LL'));

// run these first
previousCity();
showButtons();

// event listener for submit button
$('#search-city').click(function(event) {
    event.preventDefault();
    cityName = $('#search-input').val().trim();

    if(cityName === '') {
        $('.toast').toast('show');  
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
$('.pill').click(function() {
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
    var openWeatherMap = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + ',' + stateCode + "&units=imperial&appid=0db11239e44307838ff3571b683ebdc1";

    console.log(cityName + ' lol'); 

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
        var icon = tag.addClass(prefix + code);

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
            $('.uv-index').text(response.value + ' UV Index');
            $('.uv-index').removeClass('uv-low uv-moderate uv-high uv-vhigh uv-extreme');
            if (response.value <= 2.99) {
                $("#uv-level").addClass("uv-favorable");
            } else if (response.value >= 3 && response.value <= 5.99) {
                $("#uv-level").addClass("uv-moderate");
            } else if (response.value >= 6 && response.value <= 7.99) {
                $("#uv-level").addClass("uv-severe");
            } else if (response.value >= 8 && response.value <= 10) {
                $("#uv-level").addClass("uv-vhigh");
            } else {
                $("#uv-level").addClass("uv-extreme");
            }
        })
       
            var code1 = response.list[4].weather[0].id;
            var code2 = response.list[12].weather[0].id;
            var code3 = response.list[20].weather[0].id;
            var code4 = response.list[28].weather[0].id;
            var code5 = response.list[36].weather[0].id;

            var icon1 = $('<i>').addClass('wi wi-owm-' + code1);
            var icon2 = $('<i>').addClass('wi wi-owm-' + code2);
            var icon3 = $('<i>').addClass('wi wi-owm-' + code3);
            var icon4 = $('<i>').addClass('wi wi-owm-' + code4);
            var icon5 = $('<i>').addClass('wi wi-owm-' + code5);

            // A FOR DAY 1 WEATHER
            $('.weekday1').text(moment().add(1, "days").format("dddd"));
            $(".big-icon1").html(icon1);
            // $("#current-weather").text(response.list[4].weather[0].main);
            $(".weather1").text(response.list[4].weather[0].main);
            $(".hi-low1").text(response.list[4].main.temp + '°');
            $(".humidity1").text(response.list[4].main.humidity + "%");
            // PULLS DATA FOR DAY 2 WEATHER
            $('.weekday2').text(moment().add(2, "days").format("dddd"));
            $(".big-icon2").html(icon2);
            // $("#current-weather").text(response.list[12].weather[0].main);
            $(".weather2").text(response.list[12].weather[0].main);
            $(".hi-low2").text(response.list[12].main.temp + '°');
            $(".humidity2").text(response.list[12].main.humidity + "%");
            // PULLS DATA FOR DAY 3 WEATHER
            $('.weekday3').text(moment().add(3, "days").format("dddd"));
            $(".big-icon3").html(icon3);
            // $("#current-weather").text(response.list[20].weather[0].main);
            $(".weather3").text(response.list[20].weather[0].main);
            $(".hi-low3").text(response.list[20].main.temp + '°');
            $(".humidity3").text(response.list[20].main.humidity + "%");
            // PULLS DATA FOR DAY 4 WEATHER
            $('.weekday4').text(moment().add(4, "days").format("dddd"));
            $(".big-icon4").html(icon4);
            // $("#current-weather").text(response.list[28].weather[0].main);
            $(".weather4").text(response.list[28].weather[0].main);
            $(".hi-low4").text(response.list[28].main.temp + '°');
            $(".humidity4").text(response.list[28].main.humidity + "%");
            // PULLS DATA FOR DAY 5 WEATHER
            $('.weekday5').text(moment().add(5, "days").format("dddd"));
            $(".big-icon5").html(icon5);
            // $("#current-weather").text(response.list[36].weather[0].main);
            $(".weather5").text(response.list[36].weather[0].main);
            $(".hi-low5").text(response.list[36].main.temp + '°');
            $(".humidity5").text(response.list[36].main.humidity + "%"); 
        
    })
}