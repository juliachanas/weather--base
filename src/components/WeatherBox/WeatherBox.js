import PickCity from '../PickCity/PickCity';
import WeatherSummary from '../WeatherSummary/WeatherSummary';
import ErrorBox from '../ErrorBox/ErrorBox';
import Loader from '../Loader/Loader';
import { useCallback } from 'react';
import { useState } from 'react';

const WeatherBox = (props) => {
  const [weatherData, setWeatherData] = useState(null);
  const [pending, setPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState(null);

  const handleCityChange = useCallback((city) => {
    setPending(true);
    setIsError(false);
    setMessage(null);
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d6c25844f1a88451f43da0c2a129db17&units=metric`
    ).then((res) => {
      if (res.status === 200) {
        return res.json().then((data) => {
          setPending(false);
          const newWeatherData = {
            city: data.name,
            temp: data.main.temp,
            icon: data.weather[0].icon,
            description: data.weather[0].main,
          };
          setWeatherData(newWeatherData);
          console.log(newWeatherData);
        });
      } else {
        return res.json().then((data) => {
          setMessage(data.message);
          setPending(false);
          setIsError(true);
        });
      }
    });
  }, []);

  return (
    <section>
      <PickCity action={handleCityChange} />
      {weatherData && !pending && !isError && (
        <WeatherSummary {...weatherData} weatherData={weatherData} />
      )}
      {pending && <Loader />}
      {!pending && isError && <ErrorBox>{message}</ErrorBox>}
    </section>
  );
};

export default WeatherBox;
