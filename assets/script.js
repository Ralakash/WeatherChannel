var savedCitys = [];
var cityName;
// Grabs the information from the form cityName and uses it to run the function weatherCard. Awaits that data then runs schoolCard using a subset of that information
$('#saveBtn').on('click', function (event) {
  event.preventDefault();
  // for (let i = 0; i < cardID.length; i++) {
  //   $(cardID[i]).remove();
  //   $(buttonID[i]).remove();
  // }
  $('#containerEL').empty;
  cityName = $('#cityName').val();
  const dataInfo = weather(cityName);
  weatherCard(dataInfo);
});

// Fetches the weather based on the city name generated in the form #cityName.
const weather = (city) => {
  const openweathermapKey = '99f3a7e5c08aca58214a5ff5a0495fd1';
  return fetch(
    'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + openweathermapKey + '&units=imperial'
  ).then((res) => res.json());
};

// Creates a card element with weather data after retrieving information from weather.
let cardID = [];
let cardBodyID = [];
let buttonID = [];
const weatherCard = async (resultsInfo) => {
  let weather1 = [];
  await resultsInfo.then((weatherData) => {
    weather1 = weatherData.list;
    return weather1;
  });
  debugger;
  console.log(weather1[1].main.temp);
  console.log(weather1.length);
  for (let i = 0; i < weather1.length; i + 8) {
    cardID[i] = '#card' + i;
    cardBodyID[i] = '#card-body' + i;
    buttonID[i] = '#saveButton' + i;

    $('#containerEL').append(
      '<div class="card col-8 row container-fluid d-flex flex-row mt-2" id="card' + i + '"></div>'
    );
    $(cardID[i]).append('<div class="card-body col-8 container-fluid" id="card-body' + i + '"></div>');
    $(cardBodyID[i]).html(
      'City: ' +
        cityName +
        '<br/> Date and Time: ' +
        weather1[i].dt_txt +
        '<br/> Temperature(F): ' +
        weather1[i].main.temp +
        '° <br/> Wind Speed: ' +
        weather1[i].wind.speed +
        '<br/> Humidity: ' +
        weather1[i].main.humidity
    );

    // creates a button element that is used to save data to local storage.
    let button = $('<button type="button" class="btn btn-secondary col-2 my-2" id=saveButton' + i + '>Save</button>');
    $(cardID[i]).append(button);
    let cityObject = {
      name: cityName,
    };
    // creates a sidebar that lists saved colleges, on a click function.
    $(button).click(function (event) {
      savedCitys.push(cityObject);
      writeToSave();
      savedCitys = [];
    });
  }
};

const writeToSave = () => {
  if (JSON.parse(localStorage.getItem('colleges')) != null) {
    savedCitys = savedCitys.concat(JSON.parse(localStorage.getItem('colleges')));
  }
  // searches the local storage for repeat elements and removes them to avoid duplicates.
  savedCitys = savedCitys.reduce((finalArray, current) => {
    let obj = finalArray.find((item) => item.name === current.name);
    if (obj) {
      return finalArray;
    } else {
      return finalArray.concat([current]);
    }
  }, []);
  localStorage.setItem('colleges', JSON.stringify(savedCitys));
  $('#sideBar').empty();
  for (let i = 0; i < savedCitys.length; i++) {
    let savedBodyID = [];
    let savedID = [];
    savedID[i] = '#saved' + i;
    savedBodyID[i] = '#saved-body' + i;
    $('#sideBar').append('<div class="card col-9 row mb-2"  id="saved' + i + '"></div>');
    let closeBtn = $(
      '<button type="button" class="btn btn-outline-danger btn-sm col-2 align-self-end" id="close' + i + '">X</button>'
    );
    $(closeBtn).click(function (event) {
      savedCitys = savedCitys.concat(JSON.parse(localStorage.getItem('colleges')));
      savedCitys.splice(i, 1);
      localStorage.setItem('colleges', JSON.stringify(savedCitys));
      writeToSave();
    });
    $(savedID[i]).append(closeBtn);
    $(savedID[i]).append('<div class="card-body col-10" id="saved-body' + i + '"></div>');
    $(savedBodyID[i]).html(
      '<a href="' +
        savedCitys[i].url +
        '" target="_blank">' +
        savedCitys[i].name +
        '</a><br/> ' +
        savedCitys[i].temp +
        '°'
    );
    console.log('this is safved citys' + savedCitys[i]);
  }
  savedCitys = [];
};
writeToSave();
