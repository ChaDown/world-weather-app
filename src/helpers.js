/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
import { format, fromUnixTime } from 'date-fns';

import sun from './assets/sun.jpg';
import clear from './assets/clear.jpg';
import clouds from './assets/clouds.jpg';
import rain from './assets/rain.jpg';
import thunder from './assets/thunder.jpg';
import snow from './assets/snow.jpg';
import mist from './assets/mist.jpg';
import bgImg from './assets/bg-img.jpg';

export function getCurrentTime(tzShift) {
  // function to convert users time to time of searched city.
  const date = new Date();
  // in ms, convert to s
  const time = date.getTime() / 1000;
  // in mins, convert to s
  const localOffset = date.getTimezoneOffset() * 60;
  const utc = time + localOffset;
  const cityTime = fromUnixTime(utc + tzShift);
  const formatTime = format(cityTime, "LLL d 'at' k:mm");

  return formatTime;
}

export function getWindDir(degree) {
  if (degree > 337.5) return 'N';
  if (degree > 292.5) return 'NW';
  if (degree > 247.5) return 'W';
  if (degree > 202.5) return 'SW';
  if (degree > 157.5) return 'S';
  if (degree > 122.5) return 'SE';
  if (degree > 67.5) return 'E';
  if (degree > 22.5) return 'NE';

  return 'N';
}

export function capitalizeFirstLetter(str) {
  const words = str.split(' ');

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
  }

  const newStr = words.join(' ');

  return newStr;
}

export function dataFilter(obj) {
  const { description, icon } = obj.weather[0];
  const cleanDescription = capitalizeFirstLetter(description);
  const { name } = obj;
  const time = getCurrentTime(obj.timezone);
  const { temp, humidity, feels_like } = obj.main;
  const roundedTemp = Math.round(temp);
  const roundedFeelsLike = Math.round(feels_like);
  const { speed, deg } = obj.wind;
  const roundedWind = Math.round(speed);
  const windDirection = getWindDir(deg);

  return {
    cleanDescription,
    icon,
    name,
    time,
    roundedTemp,
    humidity,
    roundedFeelsLike,
    roundedWind,
    windDirection,
  };
}

function getExtremeTemp(arr, type) {
  const tempsArr = [];
  let extremeTemp;
  if (type === 'max') {
    arr.forEach((el) => tempsArr.push(el.tempMax));
    extremeTemp = tempsArr.reduce((a, b) => Math.max(a, b));
  } else if (type === 'min') {
    arr.forEach((el) => tempsArr.push(el.tempMin));
    extremeTemp = tempsArr.reduce((a, b) => Math.min(a, b));
  }
  return extremeTemp;
}

export function forecastFilter(obj) {
  const forecastArr = [];
  const daysArr = obj.list;

  daysArr.forEach((el) => {
    const weather = {
      day: format(fromUnixTime(el.dt), 'E'),
      time: format(fromUnixTime(el.dt), 'H'),
      icon: el.weather[0].icon,
      tempMax: Math.round(el.main.temp_max),
      tempMin: Math.round(el.main.temp_min),
    };

    forecastArr.push(weather);
  });

  // Group forecasts into same day arrays
  const groupedArray = [[forecastArr[0]]];

  for (let i = 1; i < forecastArr.length; i++) {
    // If the day value of the i object matches the last item in the previous array, push it to that array.
    const lastArr = groupedArray[groupedArray.length - 1];
    const lastObj = lastArr[lastArr.length - 1];

    if (forecastArr[i].day === lastObj.day) {
      lastArr.push(forecastArr[i]);
    } else groupedArray.push([forecastArr[i]]);
  }

  // Return one object per day, with daily max and min and weather at midday.
  const dailyForecasts = [];

  for (let i = 1; i < 5; i++) {
    const dayForecast = {
      day: groupedArray[i][1].day,
      icon: groupedArray[i][4].icon,
      tempMax: getExtremeTemp(groupedArray[i], 'max'),
      tempMin: getExtremeTemp(groupedArray[i], 'min'),
    };
    dailyForecasts.push(dayForecast);
  }

  return dailyForecasts;
}

export function CtoF(tempC) {
  const tempF = Math.round(tempC * (9 / 5) + 32);
  return tempF;
}

export function unitHandler() {
  const imperialArr = document.querySelectorAll('.imperial');
  const metricArr = document.querySelectorAll('.metric');

  imperialArr.forEach((el) => el.classList.toggle('hidden'));
  metricArr.forEach((el) => el.classList.toggle('hidden'));
}

export function setBackgroundImage(obj) {
  const code = obj.filteredData.icon;
  const bodyBackground = document.body.style;

  if (code === '01d') {
    bodyBackground.backgroundImage = `url(${clear})`;
  } else if (code === '02d' || code === '03d') {
    bodyBackground.backgroundImage = `url(${sun})`;
  } else if (code === '04d') {
    bodyBackground.backgroundImage = `url(${clouds})`;
  } else if (code === '09d' || code === '10d') {
    bodyBackground.backgroundImage = `url(${rain})`;
  } else if (code === '11d') {
    bodyBackground.backgroundImage = `url(${thunder})`;
  } else if (code === '13d') {
    bodyBackground.backgroundImage = `url(${snow})`;
  } else if (code === '50d') {
    bodyBackground.backgroundImage = `url(${mist})`;
  } else bodyBackground.backgroundImage = `url(${bgImg})`;
}
