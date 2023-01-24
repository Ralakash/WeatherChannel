var savedCitys = [];
var cityName;
// Grabs the information from the form cityName and uses it to run the function weatherCard. Awaits that data then runs schoolCard using a subset of that information
$('#saveBtn').on('click', function (event) {
  event.preventDefault();
  // for (let index = 0; index < cardID.length; index++) {
  //   $(cardID[index]).remove();
  //   $(buttonID[index]).remove();
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
  console.log(weather1[1].main.temp);
  console.log(weather1.length);

  for (let i = 0; i < weather1.length / 8; i++) {
    console.log(i);
    let index = i * 8;
    cardID[index] = '#card' + index;
    cardBodyID[index] = '#card-body' + index;
    buttonID[index] = '#saveButton' + index;

    $('#containerEL').append(
      '<div class="card col-8 row container-fluid d-flex flex-row mt-2" id="card' + index + '"></div>'
    );
    $(cardID[index]).append('<div class="card-body col-8 container-fluid" id="card-body' + index + '"></div>');
    $(cardBodyID[index]).html(
      'City: ' +
        cityName +
        '<br/> Date and Time: ' +
        weather1[index].dt_txt +
        '<br/> Temperature(F): ' +
        weather1[index].main.temp +
        '° <br/> Wind Speed: ' +
        weather1[index].wind.speed +
        '<br/> Humidity: ' +
        weather1[index].main.humidity
    );

    // creates a button element that is used to save data to local storage.
    let button = $(
      '<button type="button" class="btn btn-secondary col-2 my-2" id=saveButton' + index + '>Save</button>'
    );
    $(cardID[index]).append(button);
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
  for (let index = 0; index < savedCitys.length; index++) {
    let savedBodyID = [];
    let savedID = [];
    savedID[index] = '#saved' + index;
    savedBodyID[index] = '#saved-body' + index;
    $('#sideBar').append('<div class="card col-9 row mb-2"  id="saved' + index + '"></div>');
    let closeBtn = $(
      '<button type="button" class="btn btn-outline-danger btn-sm col-2 align-self-end" id="close' +
        index +
        '">X</button>'
    );
    $(closeBtn).click(function (event) {
      savedCitys = savedCitys.concat(JSON.parse(localStorage.getItem('colleges')));
      savedCitys.splice(index, 1);
      localStorage.setItem('colleges', JSON.stringify(savedCitys));
      writeToSave();
    });
    $(savedID[index]).append(closeBtn);
    $(savedID[index]).append('<div class="card-body col-10" id="saved-body' + index + '"></div>');
    $(savedBodyID[index]).html(savedCitys[index].name);
    console.log(savedCitys[index]);
  }
  savedCitys = [];
};
writeToSave();
