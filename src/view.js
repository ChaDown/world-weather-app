/* eslint-disable comma-dangle */
import { CtoF, unitHandler } from './helpers';

export function renderMain(obj) {
  const data = obj.filteredData;

  const upperContainer = document.querySelector('.upper-container');
  upperContainer.innerHTML = '';

  const markUp = `    <div class="weather-container">
  <div class="description left-text">${data.cleanDescription}&nbsp</div>
  <img src="http://openweathermap.org/img/wn/${data.icon}@2x.png">
  <div class="place left-text">${data.name}</div>
  <div class="time left-text">${data.time}</div>
  <div class="temp left-text metric">${data.roundedTemp}°</div>
  <div class="temp left-text imperial hidden">${CtoF(
    data.roundedTemp
  )}°&nbspF</div>
  <button class="unit-btn">C / F</button>
</div>
<div class="weather-info-container">
 <div class="feels-like text">Feels like</div>
 <div class="feels-like  metric">${data.roundedFeelsLike}°</div>
 <div class="feels-like  imperial hidden">${CtoF(
   data.roundedFeelsLike
 )}°&nbspF</div>
 <div class="humidity  text">Humidity</div>
 <div class="humidity">${data.humidity}%</div>
 <div class="wind text">Wind</div>
 <div class="wind metric">${data.roundedWind} km/h ${data.windDirection}</div>
 <div class="wind imperial hidden">${Math.round(
   data.roundedWind * 0.621371
 )} mp/h ${data.windDirection}</div>
</div>`;

  upperContainer.innerHTML = markUp;

  const unitBtn = document.querySelector('.unit-btn');
  unitBtn.addEventListener('click', unitHandler);
}

export function renderForecast(obj) {
  const data = obj.filteredForecastData;
  const forecastContainer = document.querySelector('.forecast-container');
  forecastContainer.innerHTML = '';

  data.forEach((el) => {
    const markUp = `
    <div class="forecast-day">
    <div class="name">${el.day}</div>
    <img src="http://openweathermap.org/img/wn/${el.icon}@2x.png">
    <div class="temp-max metric">${el.tempMax}°</div>
    <div class="temp-max imperial hidden">${CtoF(el.tempMax)}°&nbspF</div>
    <div class="temp-min metric">${el.tempMin}°</div>
    <div class="temp-min imperial hidden">${CtoF(el.tempMin)}°&nbspF</div>
    
    </div>`;

    forecastContainer.innerHTML += markUp;
  });
}
