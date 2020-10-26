$(document).ready(function () {
    let dateEl = $("#date");
    let cityNameEl = $("#cityName");
    let tempEl = $("#temp");
    let humidityEl = $("#humidity");
    let uvEl = $("#UV");
    let iconEl = $("#icon");
    let weatherBlockEl = $("#weatherBlock");
    let windEl = $("#wind");
    let searchCityEl = $("#searchCity");
  
    let timeNow = moment().format("lll");
    let weatherHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  
    function renderSavedbuttons() {
      $("#saved-search").empty();
      let filteredHistory = new Set(weatherHistory);
      filteredHistory.forEach(function (cityName, i) {
        if (i > 4) return;
        console.log(cityName);
        console.log(i);
        let a = $("<button>");
        a.addClass("saved-search");
        a.text(cityName);
        $("#saved-search").prepend(a);
      });
    }
    function buildQueryURL(queryParams) {
      let apiKeyEl = "&appid=a06616f61f91523719a0a3d477f3df93";
  
      if (queryParams === "") {
        return buildQueryURL();
      }
  
      weatherHistory.push(queryParams);
      localStorage.setItem("weatherHistory", JSON.stringify(weatherHistory));
      renderSavedbuttons();
      let queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        queryParams +
        apiKeyEl;
      return queryURL;
    }
    function buildQueryURL5(queryParams) {
      let apiKeyEl = "&appid=a06616f61f91523719a0a3d477f3df93";
  
      let queryURL5 =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        queryParams +
        apiKeyEl;
      return queryURL5;
    }
    function handleSearch(queryParams) {
      let queryURL = buildQueryURL(queryParams);
  
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        const results = response;
        console.log(results);
        let latEl = results.coord.lat;
        let lonEl = results.coord.lon;
        let apiKeyEl = "a06616f61f91523719a0a3d477f3df93";
        let queryURLuv =
          "http://api.openweathermap.org/data/2.5/uvi?lat=" +
          latEl +
          "&lon=" +
          lonEl +
          "&appid=" +
          apiKeyEl;
        console.log(latEl, lonEl);
        console.log(queryURLuv);
  
        cityNameEl.text(results.name);
  
        tempEl.html(
          " Temperature: " + convertKtoF(parseFloat(results.main.temp)) + "&deg;F"
        );
        humidityEl.text(" Humidity: " + results.main.humidity + "%");
        windEl.text(" Windspeed: " + results.wind.speed + "m/s");
        // UV function here__________
  
        $.ajax({
          url: queryURLuv,
          method: "GET",
        }).then(function (responseUV) {
          console.log(responseUV);
          uvEl.text(" UV Index: " + responseUV.value);
        });
        console.log(uvEl);
      });
      function convertKtoF(tempInKelvin) {
        return (Math.floor(tempInKelvin - 273.15) * 9) / 5 + 32;
      }
  
      let queryURL5 = buildQueryURL5(queryParams);
  
      $.ajax({
        url: queryURL5,
        method: "GET",
      }).then(function (response) {
        let fiveDayrep = response;
        $("tbody").empty();
        fiveDaytempTiDay = $("<th>" + "Date" + "<th>");
        fiveDaytempTiTemp = $("<th>" + "Temperature" + "<th>");
        fiveDaytempTHum = $("<th>" + "Humidity" + "<th>");
        fiveDaytempTWind = $("<th>" + "Windspeed" + "<th>");
        fiveDaytempTUV = $("<th>" + "UV" + "<th>");
  
        $("tbody").append(
          fiveDaytempTiDay,
          fiveDaytempTiTemp,
          fiveDaytempTHum,
          fiveDaytempTWind,
          fiveDaytempTUV
        );
        for (let i = 0; i < fiveDayrep.list.length; i++) {
          if (i % 8 === 0) {
            let tRow = $("<tr>");
            let dateStamp = new Date(fiveDayrep.list[i].dt * 1000);
            fiveDayDate = $("<td>" + dateStamp + "<td>");
            fiveDayTemp = $(
              "<td>" +
                convertKtoF(parseFloat(fiveDayrep.list[i].main.temp)) +
                "&deg;F" +
                "<td>"
            );
            fiveDayHum = $(
              "<td>" + fiveDayrep.list[i].main.humidity + "%" + "<td>"
            );
            fiveDayWind = $(
              "<td>" + fiveDayrep.list[i].wind.speed + "m/s" + "<td>"
            );
            tRow.append(fiveDayDate, fiveDayTemp, fiveDayHum, fiveDayWind);
            $("tbody").append(tRow);
          }
        }
      });
    }
    $("#searchCity").on("click", function (event) {
      event.preventDefault();
      let queryParams = $("#citySearch").val().trim();
      handleSearch(queryParams);
    });
    // adding a click handle to a dynamic element requires a workaround.
    $("#saved-search").on("click", ".saved-search", function (event) {
      event.preventDefault();
      console.log($(this).text());
      let queryParams = $(this).text();
  
      handleSearch(queryParams);
    });
    dateEl.append(timeNow);
    renderSavedbuttons();
  });