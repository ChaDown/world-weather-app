/* eslint-disable wrap-iife */
/* eslint-disable comma-dangle */
import { dataFilter, forecastFilter, setBackgroundImage } from './helpers';
import './style.css';
import { renderMain, renderForecast } from './view';

async function getData(location) {
  const APIkey = 'b5147fb350104350b3316f931f7ceee4';
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${APIkey}
    `
  );

  const coords = await response.json();
  const { lat, lon } = coords[0];

  const dataResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`
  );
  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`
  );
  const weatherData = await dataResponse.json();
  const forecastData = await forecastRes.json();

  const filteredForecastData = forecastFilter(forecastData);
  const filteredData = dataFilter(weatherData);

  return { filteredData, filteredForecastData };
}

function searchHandler(e) {
  e.preventDefault();

  const input = document.getElementById('location').value;

  (async () => {
    const inputWeather = await getData(input);
    setBackgroundImage(inputWeather);
    renderMain(inputWeather);
    renderForecast(inputWeather);
  })();
}

(function init() {
  const searchBtn = document.querySelector('.search-btn');
  const input = document.getElementById('location');

  searchBtn.addEventListener('click', searchHandler);

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchBtn.click();
    }
  });
})();
