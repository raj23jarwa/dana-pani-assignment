import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./slices/WeatherSlice";

const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});

export default store;