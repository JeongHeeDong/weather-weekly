export interface GeoLocation {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  timezone: string;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
}

export interface DailyWeather {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProb: number;
  windSpeed: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyWeather[];
  location: GeoLocation;
}

export interface SearchResult {
  id: number;
  name: string;
  country: string;
  admin1: string;
  latitude: number;
  longitude: number;
  timezone: string;
}
