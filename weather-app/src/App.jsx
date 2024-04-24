/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Icon from "react-icons-kit";
import { search } from "react-icons-kit/feather/search";
import { arrowUp } from "react-icons-kit/feather/arrowUp";
import { arrowDown } from "react-icons-kit/feather/arrowDown";
import { droplet } from "react-icons-kit/feather/droplet";
import { wind } from "react-icons-kit/feather/wind";
import { activity } from "react-icons-kit/feather/activity";
import { useDispatch, useSelector } from "react-redux";
import { get5DaysForecast, getCityData } from "./store/slices/WeatherSlice";
import { SphereSpinner } from "react-spinners-kit";

function App() {
  // redux state
  const {
    citySearchLoading,
    citySearchData,
    forecastLoading,
    forecastData,
    forecastError,
  } = useSelector((state) => state.weather);

  // main loadings state
  const [loadings, setLoadings] = useState(true);

  // check if any of redux loading state is still true
  const allLoadings = [citySearchLoading, forecastLoading];
  useEffect(() => {
    const isAnyChildLoading = allLoadings.some((state) => state);
    setLoadings(isAnyChildLoading);
  }, [allLoadings]);

  // city state
  const [city, setCity] = useState("Gurugram");

  // unit state
  const [unit, setUnit] = useState("metric"); // metric = C and imperial = F

  // toggle unit
  const toggleUnit = () => {
    setLoadings(true);
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  // dispatch
  const dispatch = useDispatch();

  // fetch data
  const fetchData = () => {
    dispatch(
      getCityData({
        city,
        unit,
      })
    ).then((res) => {
      if (!res.payload.error) {
        dispatch(
          get5DaysForecast({
            lat: res.payload.data.coord.lat,
            lon: res.payload.data.coord.lon,
            unit,
          })
        );
      }
    });
  };

  // initial render
  useEffect(() => {
    fetchData();
  }, [unit]);

  // handle city search
  const handleCitySearch = (e) => {
    e.preventDefault();
    setLoadings(true);
    fetchData();
  };

  // function to filter forecast data based on the time of the first object
  const filterForecastByFirstObjTime = (forecastData) => {
    if (!forecastData) {
      return [];
    }

    const firstObjTime = forecastData[0].dt_txt.split(" ")[1];
    return forecastData.filter((data) => data.dt_txt.endsWith(firstObjTime));
  };

  const filteredForecast = filterForecastByFirstObjTime(forecastData?.list);

  return (
    <>
      <div className="background bg-gradient-to-r from-cyan-500 to-blue-500 bg-cover bg-center bg-fixed bg-blue-50 w-full p-6">

        <div className="box bg-white rounded-lg border-2 border-white max-w-xl mx-auto overflow-y-auto shadow-lg p-6">
          <h1 className="flex items-center justify-center text-4xl p-4 from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"> Weather Forecast App</h1>

          {/* city search form */}
          <form
            autoComplete="off"
            onSubmit={handleCitySearch}
            className="flex items-center"
          >
            <label className="mr-2">
              <Icon icon={search} size={20} />
            </label>
            <input
              type="text"
              className="city-input outline-none border border-gray-300 rounded-md px-3 py-2 w-64"
              placeholder="Enter City"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              readOnly={loadings}
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              GO
            </button>
          </form>

          {/* current weather details box */}
          <div className="current-weather-details-box mt-6">
            {/* header */}
            <div className="details-box-header flex justify-between items-center">
              {/* heading */}
              <h4 className="text-gray-600">Current Weather</h4>

              {/* switch */}
              <div className="flex relative">
                <button
                  className={`switch-toggle-left bg-blue-400 h-8 w-16 shadow-md transition-all duration-300 ${unit === "metric" ? "opacity-100 text-white" : "opacity-10 font-bold  text-black"
                    }`}
                  onClick={() => setUnit("metric")}
                >
                  Celsius
                </button>
                <button
                  className={`switch-toggle-right bg-blue-400 h-8 w-16 shadow-md transition-all duration-300 ${unit === "imperial" ? "opacity-100 font-bold  text-white" : "opacity-10 text-black"
                    }`}
                  onClick={() => setUnit("imperial")}
                >
                  Kelvin
                </button>
              </div>



            </div>
            {loadings ? (
              <div className="loader">
                <SphereSpinner loadings={loadings} color="#2fa5ed" size={20} />
              </div>
            ) : (
              <>
                {citySearchData && citySearchData.error ? (
                  <div className="error-msg">{citySearchData.error}</div>
                ) : (
                  <>
                    {forecastError ? (
                      <div className="error-msg">{forecastError}</div>
                    ) : (
                      <>
                        {citySearchData && citySearchData.data ? (
                          <div className="weather-details-container flex flex-col gap-6 md:flex-row  md:gap-20 mt-4">
                            {/* details */}
                            <div className="details flex flex-col gap-6">
                              <h4 className="city-name text-blue-500">
                                {citySearchData.data.name}
                              </h4>

                              <div className="icon-and-temp flex items-center">
                                <img
                                  src={`https://openweathermap.org/img/wn/${citySearchData.data.weather[0].icon}@2x.png`}
                                  alt="icon"
                                  className="w-10 h-10 mr-2"
                                />
                                <h1 className="text-blue-500 text-4xl font-bold">
                                  {citySearchData.data.main.temp}&deg;
                                </h1>
                              </div>

                              <h4 className="description text-gray-600">
                                {citySearchData.data.weather[0].description}
                              </h4>
                            </div>

                            {/* metrics */}
                            <div className="metrics pl-4 ">
                              {/* feels like */}
                              <h4 className="text-blue-500 mb-4">
                                <span> Feels like {citySearchData.data.main.feels_like}</span>
                                &deg;C
                              </h4>

                              {/* min max temp */}
                              <div className="key-value-box flex">
                                <div className="key flex items-center">

                                  <Icon
                                    icon={arrowUp}
                                    size={20}
                                    className="icon text-blue-500"
                                  />
                                  <span className="value text-blue-500 ml-2">
                                    {citySearchData.data.main.temp_max}
                                    &deg;C
                                  </span>
                                </div>
                                <div className="key flex items-center ml-4">
                                  <Icon
                                    icon={arrowDown}
                                    size={20}
                                    className="icon text-blue-500"
                                  />
                                  <span className="value text-blue-500 ml-2">
                                    {citySearchData.data.main.temp_min}
                                    &deg;C
                                  </span>
                                </div>
                              </div>

                              {/* humidity */}
                              <div className="key-value-box flex items-center mt-4">
                                <div className="key flex items-center">
                                  <Icon
                                    icon={droplet}
                                    size={20}
                                    className="icon text-blue-500"
                                  />
                                  <span className="text-gray-600 ml-2">Humidity</span>
                                </div>
                                <div className="value">
                                  <span className="text-blue-500">
                                    {citySearchData.data.main.humidity}%
                                  </span>
                                </div>
                              </div>

                              {/* wind */}
                              <div className="key-value-box flex items-center mt-4">
                                <div className="key flex items-center">
                                  <Icon
                                    icon={wind}
                                    size={20}
                                    className="icon text-blue-500"
                                  />
                                  <span className="text-gray-600 ml-2">Wind</span>
                                </div>
                                <div className="value">
                                  <span className="text-blue-500">
                                    {citySearchData.data.wind.speed}kph
                                  </span>
                                </div>
                              </div>

                              {/* pressure */}
                              <div className="key-value-box flex items-center mt-4">
                                <div className="key flex items-center">
                                  <Icon
                                    icon={activity}
                                    size={20}
                                    className="icon text-blue-500"
                                  />
                                  <span className="text-gray-600 ml-2">Pressure</span>
                                </div>
                                <div className="value">
                                  <span className="text-blue-500">
                                    {citySearchData.data.main.pressure}hPa
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="error-msg">No Data Found</div>
                        )}
                        {/* extended forecastData */}
                        <h4 className="extended-forecast-heading text-gray-600 mt-4">
                          Extended Forecast
                        </h4>
                        {filteredForecast.length > 0 ? (
                          <div className="extended-forecasts-container mt-4 flex flex-wrap">
                            {filteredForecast.map((data, index) => {
                              const date = new Date(data.dt_txt);
                              const day = date.toLocaleDateString("en-US", {
                                weekday: "short",
                              });
                              return (
                                <div
                                  className="forecast-box w-full md:w-36 rounded-md bg-blue-500 text-white mr-4 mb-4 p-2  justify-center items-center"
                                  key={index}
                                >
                                  <h5>{day}</h5>
                                  <img
                                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                                    alt="icon"
                                  />
                                  <h5>{data.weather[0].description}</h5>
                                  <h5 className="min-max-temp font-semibold whitespace-nowrap">
                                    {data.main.temp_max}&deg; /{" "}
                                    {data.main.temp_min}&deg;
                                  </h5>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="error-msg">No Data Found</div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
